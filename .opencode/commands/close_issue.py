
#!/usr/bin/env python3

import re
import subprocess
import sys


REPO = "Delforojas/wod_explorer_2"


def run(*args):
    result = subprocess.run(
        args, text=True, capture_output=True
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr or result.stdout)
    return result.stdout.strip()


def main():
    if len(sys.argv) != 2 or not sys.argv[1].isdigit():
        sys.exit("Uso: closeissue <numero>")

    issue = sys.argv[1]

    if int(issue) < 1:
        sys.exit("BLOCKED: número de Issue inválido")

    try:
        # Verificar rama y estado Git
        if run("git", "branch", "--show-current") != "main":
            sys.exit("BLOCKED: debes estar en main")

        if run("git", "ls-files", "-u"):
            sys.exit("BLOCKED: existen conflictos Git")

        # Consultar el estado remoto actual
        run("git", "fetch", "origin", "main")

        local = run("git", "rev-parse", "main")
        remote = run("git", "rev-parse", "origin/main")

        if local != remote:
            sys.exit("BLOCKED: main no coincide con origin/main")

        # Buscar rama de la Issue
        branches = run(
            "git", "for-each-ref",
            "--format=%(refname:short)",
            "refs/heads/"
        ).splitlines()

        matches = [
            b for b in branches
            if re.match(rf"^[^/]+/{re.escape(issue)}-", b)
        ]

        if len(matches) != 1:
            sys.exit(
                "BLOCKED: no existe una única rama local "
                "identificable para esta Issue"
            )

        branch = matches[0]

        # Comprobar que está integrada en el remoto
        run(
            "git", "merge-base",
            "--is-ancestor", branch, "origin/main"
        )

        state = run(
            "gh", "issue", "view", issue,
            "--repo", REPO,
            "--json", "state",
            "--jq", ".state"
        )

        if state == "CLOSED":
            print(f"ALREADY_CLOSED: Issue #{issue}")
            return

        if state != "OPEN":
            sys.exit("BLOCKED: estado inesperado")

        print(f"\nIssue #{issue}")
        print(f"Rama integrada: {branch}")
        print("main sincronizada con GitHub")

        answer = input(
            "\n¿Cerrar la Issue como completada? [s/N]: "
        ).strip().lower()

        if answer not in ("s", "si", "sí"):
            print("Cancelado")
            return

        run(
            "gh", "issue", "close", issue,
            "--repo", REPO,
            "--reason", "completed"
        )

        print(f"\nISSUE_CLOSED: #{issue}")

    except (RuntimeError, OSError) as error:
        sys.exit(f"BLOCKED: {error}")


if __name__ == "__main__":
    main()
