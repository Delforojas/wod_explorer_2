
#!/usr/bin/env python3

import re
import subprocess
import sys
from pathlib import Path


def git(*args, check=True):
    result = subprocess.run(
        ["git", *args],
        text=True,
        capture_output=True,
    )

    if check and result.returncode != 0:
        raise RuntimeError(
            f"git {' '.join(args)}\n"
            f"{result.stderr or result.stdout}"
        )

    return result


def output(*args):
    return git(*args).stdout.strip()


def confirm(question):
    answer = input(f"{question} [s/N]: ").strip().lower()
    return answer in ("s", "si", "sí")


def validate_worktree():
    status = output("status", "--porcelain", "--untracked-files=all")

    # Los JSON locales son contexto del workflow, no código.
    pending = []

    for line in status.splitlines():
        state = line[:2]
        path = line[3:]

        if (
            state == "??"
            and re.fullmatch(r"\.workflow/issues/\d+\.json", path)
        ):
            continue

        pending.append(line)

    if pending:
        raise RuntimeError(
            "Hay cambios pendientes que deben revisarse:\n"
            + "\n".join(pending)
        )


def validate_git_state():
    git_dir = Path(output("rev-parse", "--absolute-git-dir"))

    for marker in ("MERGE_HEAD", "CHERRY_PICK_HEAD", "REVERT_HEAD"):
        if (git_dir / marker).exists():
            raise RuntimeError(f"Operación Git pendiente: {marker}")

    for directory in ("rebase-merge", "rebase-apply"):
        if (git_dir / directory).exists():
            raise RuntimeError("Hay un rebase pendiente.")


def find_issue_branch(issue):
    branches = output(
        "for-each-ref",
        "--format=%(refname:short)",
        "refs/heads/",
    ).splitlines()

    pattern = re.compile(rf"^[^/]+/{re.escape(issue)}-")

    matches = [
        branch for branch in branches
        if pattern.match(branch)
    ]

    if not matches:
        raise RuntimeError(
            f"No existe ninguna rama local para la Issue #{issue}."
        )

    if len(matches) > 1:
        raise RuntimeError(
            "Hay varias ramas para esta Issue:\n"
            + "\n".join(matches)
            + "\nSelecciona o resuelve la ambigüedad manualmente."
        )

    return matches[0]


def main():
    if len(sys.argv) != 2 or not sys.argv[1].isdigit():
        sys.exit("Uso: missue <numero-issue>")

    issue = sys.argv[1]

    if int(issue) < 1:
        sys.exit("BLOCKED: número de Issue inválido.")

    try:
        root = Path(output("rev-parse", "--show-toplevel"))
        if Path.cwd().resolve() != root.resolve():
            raise RuntimeError(
                "Ejecuta el script desde la raíz del repositorio."
            )

        validate_git_state()
        validate_worktree()

        current = output("branch", "--show-current")

        if not current:
            raise RuntimeError("Git está en detached HEAD.")

        branch = find_issue_branch(issue)

        print(f"\n=== MERGE ISSUE #{issue} ===")
        print(f"Rama actual: {current}")
        print(f"Rama de Issue: {branch}")

        if not confirm(
            f"¿Cambiar a main y preparar el merge de '{branch}'?"
        ):
            print("Cancelado.")
            return

        # 1. Cambiar a main
        print("\n[1/5] Cambiando a main...")
        git("switch", "main")

        # 2. Actualizar main
        print("[2/5] Actualizando main...")
        git("pull", "--ff-only", "origin", "main")

        validate_git_state()
        validate_worktree()

        # 3. Verificar si ya está integrada
        already_merged = git(
            "merge-base", "--is-ancestor", branch, "main",
            check=False,
        )

        if already_merged.returncode == 0:
            print(
                "\nALREADY_MERGED: la rama ya está integrada en main."
            )
            return

        if already_merged.returncode != 1:
            raise RuntimeError(
                "No se pudo comprobar la relación entre las ramas."
            )

        print("\n=== COMMITS PENDIENTES ===")
        print(output("log", "--oneline", f"main..{branch}"))

        if not confirm(f"¿Integrar '{branch}' en main?"):
            print("Cancelado. Main está actualizada.")
            return

        # 4. Merge sin abrir Vim
        print("\n[3/5] Integrando rama...")
        git("merge", "--no-ff", "--no-edit", branch)

        # 5. Verificar resultado
        print("\n[4/5] Comprobando resultado...")
        print("\n=== GIT STATUS ===")
        print(output("status"))

        print("\n=== ÚLTIMOS COMMITS ===")
        print(output("log", "--oneline", "-3"))

        validate_git_state()
        validate_worktree()

        if not confirm("\n¿Publicar main en GitHub?"):
            print(
                "\nMERGED_LOCALLY: merge completado, "
                "push pendiente."
            )
            return

        # 6. Publicar una sola vez
        print("\n[5/5] Publicando main...")
        git("push", "origin", "main")

        print("\n=== ESTADO FINAL ===")
        print(output("status"))
        print(output("log", "--oneline", "-3"))

        print("\nMERGE_PUBLISHED")
        print(f"Issue: #{issue}")
        print(f"Rama integrada: {branch}")
        print("Destino: main")
        print("Push: completado")

    except (RuntimeError, OSError, ValueError) as error:
        sys.exit(f"\nBLOCKED: {error}")


if __name__ == "__main__":
    main()
