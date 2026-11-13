
#!/usr/bin/env python3

import json
import re
import subprocess
import sys
import unicodedata
from pathlib import Path

REPO = "Delforojas/wod_explorer_2"


def run(*args):
    """Ejecuta un comando y devuelve su salida."""
    result = subprocess.run(
        args,
        text=True,
        capture_output=True,
    )

    if result.returncode != 0:
        raise RuntimeError(
            f"Error ejecutando: {' '.join(args)}\n"
            f"{result.stderr or result.stdout}"
        )

    return result.stdout.strip()


def confirm(message):
    answer = input(f"{message} [s/N]: ").strip().lower()
    return answer in ("s", "si", "sí")


def slugify(text):
    normalized = unicodedata.normalize("NFKD", text)
    ascii_text = normalized.encode("ascii", "ignore").decode()
    slug = re.sub(r"[^a-z0-9]+", "-", ascii_text.lower())
    return slug.strip("-")[:45].rstrip("-")


def main():
    if len(sys.argv) != 2 or not sys.argv[1].isdigit():
        print("Uso: python3 scripts/prepare_issue.py <numero>")
        sys.exit(1)

    issue_number = int(sys.argv[1])

    if issue_number < 1:
        sys.exit("BLOCKED: número de Issue inválido.")

    try:
        # 1. Comprobar repositorio
        root = Path(run("git", "rev-parse", "--show-toplevel"))
        current_directory = Path.cwd().resolve()

        if current_directory != root.resolve():
            sys.exit("BLOCKED: ejecuta desde la raíz del repositorio.")

        branch = run("git", "branch", "--show-current")
        status = run("git", "status", "--porcelain")

        print(f"\nIssue: #{issue_number}")
        print(f"Rama actual: {branch or '(detached HEAD)'}")

        if not branch:
            sys.exit("BLOCKED: Git está en detached HEAD.")

        if status:
            sys.exit(
                "BLOCKED: hay cambios locales pendientes.\n"
                "Revisa git status antes de continuar."
            )

        if run("git", "ls-files", "-u"):
            sys.exit("BLOCKED: existen conflictos Git pendientes.")

        # 2. Obtener la Issue desde GitHub CLI
        raw_issue = run(
            "gh", "issue", "view", str(issue_number),
            "--repo", REPO,
            "--json", "number,title,body,state",
        )
        issue = json.loads(raw_issue)

        if issue.get("number") != issue_number:
            sys.exit("BLOCKED: número de Issue incorrecto.")

        if issue.get("state") != "OPEN":
            sys.exit("BLOCKED: la Issue no está abierta.")

        if not issue.get("body", "").strip():
            sys.exit("BLOCKED: la Issue no tiene requisitos.")

        # 3. Proponer rama
        title = issue["title"]
        name = re.sub(r"^(feat|fix|docs|refactor|test)(\([^)]*\))?:\s*", "", title, flags=re.I)

        prefix = "feat"
        match = re.match(r"^(feat|fix|docs|refactor|test)", title, re.I)
        if match:
            prefix = match.group(1).lower()

        proposed_branch = f"{prefix}/{issue_number}-{slugify(name)}"

        issue_path = root / ".workflow" / "issues" / f"{issue_number}.json"

        if issue_path.exists():
            sys.exit(f"BLOCKED: ya existe {issue_path}")

        existing_branches = run(
            "git", "branch", "--list", proposed_branch
        )

        if existing_branches:
            sys.exit(f"BLOCKED: ya existe la rama {proposed_branch}")

        print(f"\nTítulo: {title}")
        print(f"Rama propuesta: {proposed_branch}")

        # 4. Confirmar origen
        if branch != "main":
            if not confirm(
                f"\nEstás en '{branch}', no en main. "
                "¿Quieres cambiar a main?"
            ):
                sys.exit("Cancelado. No se han realizado cambios.")

        if not confirm(
            f"¿Actualizar main y crear '{proposed_branch}'?"
        ):
            sys.exit("Cancelado. No se han realizado cambios.")

        # 5. Actualizar main
        run("git", "switch", "main")
        print("\nActualizando main...")
        run("git", "pull", "--ff-only", "origin", "main")

        # 6. Crear rama de la Issue
        run("git", "switch", "-c", proposed_branch)
        print(f"Rama creada: {proposed_branch}")

        # 7. Guardar contexto local
        issue_path.parent.mkdir(parents=True, exist_ok=True)
        issue_path.write_text(
            json.dumps(issue, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )

        # 8. Comprobar resultado
        active_branch = run("git", "branch", "--show-current")
        saved_issue = json.loads(issue_path.read_text(encoding="utf-8"))

        if active_branch != proposed_branch:
            raise RuntimeError("La rama activa no coincide.")

        if saved_issue["number"] != issue_number:
            raise RuntimeError("El JSON no corresponde a la Issue.")

        print("\nPREPARED_FOR_DEV_ISSUE")
        print(f"Issue: #{issue_number}")
        print(f"Rama: {active_branch}")
        print(f"Contexto: {issue_path.relative_to(root)}")
        print(f"\nSiguiente paso: /dev-issue {issue_number}")

    except (RuntimeError, OSError, ValueError, KeyError) as error:
        sys.exit(f"\nBLOCKED: {error}")


if __name__ == "__main__":
    main()


