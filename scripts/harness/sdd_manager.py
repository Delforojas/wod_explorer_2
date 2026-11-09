#!/usr/bin/env python3
"""Issue SDD structure management. Technical PASS never replaces AI guards.

inspect/validate are read-only. prepare only creates missing structure after
comparing an explicit inspection snapshot. It never invents requirements,
overwrites files, renames ambiguous directories, completes tasks or writes Git.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import stat
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
import unicodedata


REQUIRED = ("spec.md", "plan.md", "tasks.md")
SPEC_SECTIONS = {
    "objective": {"objetivo", "objective", "goal"},
    "scope": {"alcance", "scope"},
    "expected_behavior": {"comportamiento esperado", "expected behavior", "expected behaviour",
                          "decisiones funcionales", "requisitos funcionales"},
    "acceptance_criteria": {"criterios de aceptacion", "acceptance criteria"},
}


class SDDError(Exception):
    """An unsafe or unverifiable SDD state."""


sys.dont_write_bytecode = True
from evidence_manager import managed_operation, read_json

def repository_root(selected=None):
    env = {**os.environ, "GIT_OPTIONAL_LOCKS": "0", "GIT_TERMINAL_PROMPT": "0"}
    result = subprocess.run(["git", "-C", str(selected or Path.cwd()), "rev-parse", "--show-toplevel"],
                            capture_output=True, timeout=20, env=env)
    if result.returncode:
        raise SDDError("Cannot identify the Git repository root")
    return Path(os.fsdecode(result.stdout).strip()).resolve()


def repository_identity(root):
    env = {**os.environ, "GIT_OPTIONAL_LOCKS": "0", "GIT_TERMINAL_PROMPT": "0"}
    state = {}
    for key, args in (("branch", ["branch", "--show-current"]),
                      ("head_sha", ["rev-parse", "--verify", "HEAD"])):
        result = subprocess.run(["git", "-C", str(root), *args], capture_output=True,
                                timeout=20, env=env)
        if result.returncode and key == "branch":
            raise SDDError("Cannot determine the active branch")
        state[key] = os.fsdecode(result.stdout).strip() if result.returncode == 0 else None
    return state


def canonical_digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(",", ":"),
                                     ensure_ascii=True).encode()).hexdigest()


def meaningful(line):
    line = re.sub(r"^\s*(?:[-*+]|\d+[.)])\s+", "", line).strip()
    line = re.sub(r"^\[[^\]]*\]\s*", "", line).strip()
    line = line.strip("*_` ")
    return bool(line and not line.startswith("#") and not re.fullmatch(r"[-=]+", line)
                and line.casefold() not in {"todo", "tbd", "pendiente", "por definir", "completar"}
                and not re.fullmatch(r"<[^>]*>", line))


def task_phase(text):
    """Return the workflow phase encoded by an optional task annotation."""
    markers = re.findall(r"\[\s*phase\b[^\]]*\]", text, flags=re.IGNORECASE)
    if not markers:
        return 6, True, text
    if markers != ["[phase:7]"]:
        return None, False, text
    return 7, True, text.replace("[phase:7]", "", 1).lstrip()


def markdown_content(raw):
    """Extract observable sections/checklists, ignoring code fences and comments."""
    sections = []
    tasks = []
    visible = []
    fence = None
    in_comment = False
    for number, original in enumerate(raw.splitlines(), 1):
        line = original
        # HTML comments may span lines and must not make an empty SDD pass.
        while True:
            if in_comment:
                end = line.find("-->")
                if end == -1:
                    line = ""
                    break
                line, in_comment = line[end + 3:], False
            start = line.find("<!--")
            if start == -1:
                break
            end = line.find("-->", start + 4)
            if end != -1:
                line = line[:start] + line[end + 3:]
            else:
                line, in_comment = line[:start], True
                break
        marker = re.match(r"^\s{0,3}(`{3,}|~{3,})(.*)$", line)
        if fence:
            if marker and marker[1][0] == fence[0] and len(marker[1]) >= fence[1] and not marker[2].strip():
                fence = None
            continue
        if marker:
            fence = (marker[1][0], len(marker[1]))
            continue
        visible.append(line)
        heading = re.match(r"^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$", line)
        if heading:
            title = re.sub(r"^\d+(?:\.\d+)*[.)]?\s+", "", heading[2])
            title = unicodedata.normalize("NFKD", title)
            title = "".join(char for char in title if not unicodedata.combining(char))
            title = re.sub(r"[*_`:]", "", title).strip().casefold()
            sections.append({"title": heading[2], "normalized": title, "line": number,
                             "level": len(heading[1]), "content": []})
        elif sections:
            sections[-1]["content"].append(line)
        task = re.match(r"^\s*(?:[-*+]|\d+[.)])\s+\[([^\]]*)\]\s*(.*)$", line)
        if task:
            state, text = task.groups()
            phase, annotation_valid, task_text = task_phase(text)
            status = "completed" if state in ("x", "X") else "pending" if state == " " else "invalid"
            if not annotation_valid:
                status = "invalid"
            tasks.append({"line": number, "raw": original, "marker": state, "text": task_text,
                           "phase": phase, "phase_annotation_valid": annotation_valid, "status": status,
                           "concrete_text_present": meaningful(task_text)})
    # A parent section may carry its content in subsections.
    for index, section in enumerate(sections):
        lines = list(section["content"])
        for following in sections[index + 1:]:
            if following["level"] <= section["level"]:
                break
            lines.extend(following["content"])
        section["has_content"] = any(meaningful(line) for line in lines)
    return {"sections": sections, "tasks": tasks,
            "substantive_content_present": any(meaningful(line) for line in visible)}


def read_regular(file):
    """Read through directory descriptors; never follow a symlink component."""
    directory_fd = os.open(file.anchor, os.O_RDONLY | os.O_DIRECTORY)
    try:
        for component in file.parts[1:-1]:
            next_fd = os.open(component, os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW,
                              dir_fd=directory_fd)
            os.close(directory_fd)
            directory_fd = next_fd
        fd = os.open(file.name, os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK, dir_fd=directory_fd)
        with os.fdopen(fd, "rb") as stream:
            before = os.fstat(stream.fileno())
            if not stat.S_ISREG(before.st_mode):
                raise SDDError("Required content must be a regular file")
            data = stream.read()
            after = os.fstat(stream.fileno())
            if (before.st_ino, before.st_size, before.st_mtime_ns) != (after.st_ino, after.st_size, after.st_mtime_ns):
                raise SDDError("File changed during inspection")
            return data, before
    finally:
        os.close(directory_fd)


def fail_walk(error):
    raise error


def file_record(file):
    info = file.lstat()
    record = {"mode": stat.S_IMODE(info.st_mode), "identity": [info.st_dev, info.st_ino],
              "mtime_ns": info.st_mtime_ns}
    if stat.S_ISLNK(info.st_mode):
        return {**record, "kind": "symlink", "target": os.readlink(file)}
    if stat.S_ISDIR(info.st_mode):
        return {**record, "kind": "directory"}
    if not stat.S_ISREG(info.st_mode):
        raise SDDError(f"Unsupported filesystem entry: {file.name}")
    data, opened = read_regular(file)
    if (info.st_dev, info.st_ino) != (opened.st_dev, opened.st_ino):
        raise SDDError("File was replaced during inspection")
    after = file.lstat()
    if (info.st_ino, info.st_size, info.st_mtime_ns) != (after.st_ino, after.st_size, after.st_mtime_ns):
        raise SDDError(f"File changed while being inspected: {file.name}")
    return {**record, "kind": "file", "size": len(data), "sha256": hashlib.sha256(data).hexdigest()}


def observe(issue, root):
    if not 1 <= issue <= 999:
        raise SDDError("Issue must be between 1 and 999: the contract requires exactly three digits")
    specs = root / "specs"
    snapshot = {"specs": None, "directories": []}
    if not os.path.lexists(specs):
        return snapshot
    if specs.is_symlink() or not specs.is_dir():
        raise SDDError("specs must be a real directory, never a symlink or file")
    snapshot["specs"] = file_record(specs)
    for folder in sorted(specs.iterdir()):
        number = re.match(r"^(\d+)", folder.name)
        if not number or int(number[1]) != issue:
            continue
        record = {"path": str(folder.relative_to(root)), "name": folder.name,
                  "valid_name": re.fullmatch(rf"{issue:03d}-[a-z0-9]+(?:-[a-z0-9]+)*", folder.name) is not None,
                  "entry": file_record(folder), "inventory": {}, "files": {}}
        snapshot["directories"].append(record)
        if record["entry"]["kind"] != "directory":
            continue
        for parent, dirs, names in os.walk(folder, followlinks=False, onerror=fail_walk):
            dirs.sort()
            names.sort()
            for name in dirs + names:
                path = Path(parent) / name
                if name == ".git":
                    raise SDDError("Embedded .git entries require manual review")
                record["inventory"][str(path.relative_to(folder))] = file_record(path)
        for name in REQUIRED:
            item = record["inventory"].get(name)
            if not item:
                record["files"][name] = {"exists": False}
            elif item["kind"] != "file":
                record["files"][name] = {"exists": True, **item, "readable_text": False}
            else:
                data, _ = read_regular(folder / name)
                if hashlib.sha256(data).hexdigest() != item["sha256"]:
                    raise SDDError(f"SDD changed while reading: {name}")
                try:
                    raw = data.decode("utf-8-sig")
                    if "\0" in raw:
                        record["files"][name] = {"exists": True, **item, "readable_text": False}
                        continue
                    record["files"][name] = {"exists": True, **item, "readable_text": True,
                                             "raw": raw, **markdown_content(raw)}
                except UnicodeDecodeError:
                    record["files"][name] = {"exists": True, **item, "readable_text": False}
    return snapshot


def structural_errors(snapshot, validate=False, require_completed=False):
    errors = []
    folders = snapshot["directories"]
    if len(folders) > 1:
        errors.append("Multiple SDD candidates exist for this Issue")
    if not folders:
        return ["Missing Issue SDD directory"] if validate else []
    for folder in folders:
        if not folder["valid_name"]:
            errors.append(f"Invalid three-digit/kebab-case directory: {folder['path']}")
        if folder["entry"]["kind"] != "directory":
            errors.append(f"SDD candidate is not a real directory: {folder['path']}")
            continue
        if any(entry["kind"] == "symlink" for entry in folder["inventory"].values()):
            errors.append(f"SDD contains symlinks requiring manual review: {folder['path']}")
        for name in REQUIRED:
            item = folder["files"][name]
            if item["exists"] and not item.get("readable_text"):
                errors.append(f"Required file is not readable UTF-8 text: {name}")
            if not validate:
                continue
            if not item["exists"]:
                errors.append(f"Missing required file: {name}")
            elif item.get("readable_text"):
                if not item["substantive_content_present"]:
                    errors.append(f"Empty or placeholder-only content: {name}")
                if name == "spec.md":
                    for required, aliases in SPEC_SECTIONS.items():
                        if not any(section["normalized"] in aliases and section["has_content"]
                                   for section in item["sections"]):
                            errors.append(f"Missing populated spec section: {required}")
                if name == "tasks.md":
                    tasks = item["tasks"]
                    if not tasks or any(task["status"] == "invalid" or not task["concrete_text_present"] for task in tasks):
                        errors.append("tasks.md must contain nonempty checkbox tasks with valid markers")
                    if require_completed and (not tasks or any(task["status"] != "completed" for task in tasks)):
                        errors.append("tasks.md still has incomplete tasks")
    return errors


@managed_operation
def inspect(issue, repo_root=None, validate=False, require_completed=False, phase=4):
    if phase not in (4, 5, 6, 7, 8, 13):
        raise SDDError("Unsupported workflow phase for SDD inspection")
    operation = "validate" if validate else "inspect"
    e = {"source": f"scripts/harness/sdd_manager.py {operation}", "phase": phase,
         "issue": issue, "observed_at": datetime.now(timezone.utc).isoformat(),
         "repository": None, "status": "BLOCK", "collection_status": "incomplete",
         "errors": [], "snapshot": None, "snapshot_sha256": None,
         "semantic_validation": "required: SDD Guard and Planning Guard",
         "invalidated_by": ["sdd-path-content-or-metadata-change", "issue-scope-context-change"]}
    try:
        root = repository_root(repo_root)
        e["repository"] = str(root)
        e["git"] = repository_identity(root)
        snapshot = observe(issue, root)
        e["snapshot"] = snapshot
        e["snapshot_sha256"] = canonical_digest(snapshot)
        e["collection_status"] = "complete"
        e["errors"] = structural_errors(snapshot, validate, require_completed)
        e["sdd_state"] = "missing" if not snapshot["directories"] else "observed"
        e["status"] = "BLOCK" if e["errors"] else "PASS"
    except (SDDError, OSError, ValueError, subprocess.TimeoutExpired) as error:
        e["errors"].append(str(error))
    return {"sdd_validation_evidence" if validate else "sdd_inspection_evidence": e}


@managed_operation
def prepare(issue, evidence_path, slug=None, repo_root=None):
    e = {"source": "scripts/harness/sdd_manager.py prepare", "phase": 4, "issue": issue,
         "observed_at": datetime.now(timezone.utc).isoformat(), "status": "BLOCK",
         "created_paths": [], "preserved_files": [], "errors": [],
         "semantic_validation": "required: fill content, validate, SDD Guard and Planning Guard"}
    lock = None
    lock_fd = None
    specs_fd = None
    folder_fd = None
    try:
        root = repository_root(repo_root)
        e["repository"] = str(root)
        prior = read_json(evidence_path)["sdd_inspection_evidence"]
        if (prior["source"] != "scripts/harness/sdd_manager.py inspect" or prior["issue"] != issue
                or prior["repository"] != str(root) or prior["collection_status"] != "complete"
                or prior["status"] != "PASS" or prior["snapshot_sha256"] != canonical_digest(prior["snapshot"])):
            raise SDDError("A complete matching PASS inspection is required")
        if slug is not None and not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug):
            raise SDDError("Slug must be nonempty lowercase kebab-case")
        identity = hashlib.sha256((str(root) + ":" + str(issue)).encode()).hexdigest()
        lock = Path(tempfile.gettempdir()) / ("sdd-manager-" + identity + ".lock")
        lock_fd = os.open(lock, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
        current_identity = repository_identity(root)
        if (current_identity != prior["git"] or not current_identity["head_sha"]
                or not current_identity["branch"]
                or current_identity["branch"] in ("main", "master")
                or not re.search(rf"(?:^|[/_-])0*{issue}(?=$|[/_-])", current_identity["branch"])):
            raise SDDError("A matching Issue work branch and unchanged HEAD are required")
        before = observe(issue, root)
        if before != prior["snapshot"]:
            raise SDDError("Inspection invalidated: SDD structure, metadata or content changed")
        errors = structural_errors(before)
        if errors:
            raise SDDError("; ".join(errors))
        existing = before["directories"]
        if existing:
            name = existing[0]["name"]
            if slug is not None and name != f"{issue:03d}-{slug}":
                raise SDDError("Existing canonical folder has a different slug; no automatic rename")
        else:
            if slug is None:
                raise SDDError("An explicitly approved --slug is required for a new SDD")
            name = f"{issue:03d}-{slug}"
        specs = root / "specs"
        if before["specs"] is None:
            specs.mkdir()
            e["created_paths"].append("specs")
        specs_fd = os.open(specs, os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW)
        if before["specs"] is not None:
            opened = os.fstat(specs_fd)
            if [opened.st_dev, opened.st_ino] != before["specs"]["identity"]:
                raise SDDError("specs directory was replaced during preparation")
        if not existing:
            os.mkdir(name, dir_fd=specs_fd)
            e["created_paths"].append("specs/" + name)
        folder_fd = os.open(name, os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW, dir_fd=specs_fd)
        if existing:
            opened = os.fstat(folder_fd)
            if [opened.st_dev, opened.st_ino] != existing[0]["entry"]["identity"]:
                raise SDDError("SDD directory was replaced during preparation")
        for filename in REQUIRED:
            if existing and existing[0]["files"][filename]["exists"]:
                e["preserved_files"].append("specs/" + name + "/" + filename)
                continue
            fd = os.open(filename, os.O_CREAT | os.O_EXCL | os.O_WRONLY | os.O_NOFOLLOW,
                         0o644, dir_fd=folder_fd)
            os.close(fd)
            e["created_paths"].append("specs/" + name + "/" + filename)
        after = observe(issue, root)
        if structural_errors(after) or len(after["directories"]) != 1:
            raise SDDError("SDD structure changed during preparation")
        if existing:
            inventory = after["directories"][0]["inventory"]
            for path, item in existing[0]["inventory"].items():
                # Directory mtimes can change when missing files are created.
                if item["kind"] == "file" and inventory.get(path) != item:
                    raise SDDError(f"Preexisting content changed during preparation: {path}")
        e.update(status="PASS", folder="specs/" + name, snapshot_sha256=canonical_digest(after),
                 validation_required=True)
    except (SDDError, OSError, ValueError, KeyError, TypeError, subprocess.TimeoutExpired) as error:
        e["errors"].append(str(error))
    finally:
        for fd in (folder_fd, specs_fd):
            if fd is not None:
                os.close(fd)
        if lock_fd is not None:
            owned = os.fstat(lock_fd)
            os.close(lock_fd)
            if lock and lock.exists():
                current = lock.lstat()
                if (current.st_dev, current.st_ino) == (owned.st_dev, owned.st_ino):
                    lock.unlink()
    return {"sdd_preparation_evidence": e}


def main():
    parser = argparse.ArgumentParser(description="Issue SDD structure manager")
    operations = parser.add_subparsers(dest="operation", required=True)
    for operation in ("inspect", "prepare", "validate"):
        subparser = operations.add_parser(operation)
        subparser.add_argument("--issue", type=int, required=True)
        subparser.add_argument("--repo-root", default=None)
        subparser.add_argument("--phase", type=int, default=4)
        if operation == "prepare":
            subparser.add_argument("--evidence-json", required=True)
            subparser.add_argument("--slug", default=None)
        if operation == "validate":
            subparser.add_argument("--require-completed", action="store_true")
    args = parser.parse_args()
    if not 1 <= args.issue <= 999:
        parser.error("--issue must be between 1 and 999 (exactly three digits)")
    if args.operation == "prepare":
        result = prepare(args.issue, args.evidence_json, args.slug, args.repo_root)
    else:
        result = inspect(args.issue, args.repo_root, args.operation == "validate",
                         getattr(args, "require_completed", False), args.phase)
    print(json.dumps(result, ensure_ascii=True, indent=2))
    return 0 if next(iter(result.values()))["status"] == "PASS" else 1


if __name__ == "__main__":
    sys.exit(main())
