
#!/usr/bin/env python3

import re
import shlex
import subprocess
import sys


def git(*args, check=True):
    result = subprocess.run(
        ["git", *args],
        text=True,
        capture_output=True,
    )
    if check and result.returncode != 0:
        raise RuntimeError(result.stderr.strip())
    return result.stdout.strip()


def confirm(question):
    return input(f"{question} [s/N]: ").strip().lower() in (
        "s", "si", "sí"
    )


def main():
    if len(sys.argv) != 2 or not sys.argv[1].isdigit():
        sys.exit("Uso: cissue <numero-issue>")

    issue = sys.argv[1]

    try:
        # Verificaciones iniciales
        branch = git("branch", "--show-current")

        if not branch or branch in ("main", "master"):
            sys.exit("BLOCKED: no se permite crear este commit en main.")

        if not re.search(rf"^[^/]+/{re.escape(issue)}-", branch):
            sys.exit(
                f"BLOCKED: la rama '{branch}' "
                f"no corresponde a la Issue #{issue}."
            )

        if git("ls-files", "-u"):
            sys.exit("BLOCKED: existen conflictos Git.")

        if git("rev-parse", "-q", "--verify", "MERGE_HEAD", check=False):
            sys.exit("BLOCKED: hay un merge pendiente.")

        if git("diff", "--cached", "--name-only"):
            sys.exit(
                "BLOCKED: ya hay archivos en staging. "
                "Revísalos antes de ejecutar cissue."
            )

        print(f"\nIssue #{issue}")
        print(f"Rama: {branch}\n")

        print("=== GIT STATUS ===")
        print(git("status", "--short") or "Sin cambios")

        print("\n=== GIT DIFF ===")
        print(git("diff", "--stat") or "Sin cambios rastreados")

        print("\nIntroduce los archivos que pertenecen a la Issue.")
        print("Separa las rutas con espacios; usa comillas si contienen espacios.")
        print("Pulsa Enter sin escribir nada para cancelar.\n")

        selected = input("Archivos: ").strip()

        if not selected:
            sys.exit("Cancelado.")

        paths = shlex.split(selected)

        # Comprobar que las rutas pertenecen al repositorio
        root = git("rev-parse", "--show-toplevel")
        from pathlib import Path

        base = Path(root).resolve()
        for path in paths:
            resolved = (Path.cwd() / path).resolve()
            if not resolved.is_relative_to(base):
                sys.exit(f"BLOCKED: ruta externa al repositorio: {path}")

        if not confirm("¿Añadir exclusivamente esos archivos?"):
            sys.exit("Cancelado.")

        # Staging selectivo
        git("add", "--", *paths)

        print("\n=== ARCHIVOS PREPARADOS ===")
        print(git("diff", "--cached", "--stat"))

        print("\n=== DIFF PREPARADO ===")
        print(git("diff", "--cached"))

        staged = git("diff", "--cached", "--name-only")
        if not staged:
            sys.exit("BLOCKED: no hay cambios para confirmar.")

        # Verificación de integridad básica
        git("diff", "--cached", "--check")

        # Proponer mensaje
        prefix, slug = branch.split("/", 1)
        description = re.sub(
            rf"^{re.escape(issue)}-",
            "",
            slug
        ).replace("-", " ")

        default_message = f"{prefix}: {description} (#{issue})"

        print(f"\nMensaje propuesto: {default_message}")
        message = input(
            "Mensaje (Enter para aceptar): "
        ).strip() or default_message

        if not confirm("¿Crear el commit con estos cambios?"):
            sys.exit(
                "Cancelado. Los archivos permanecen en staging."
            )

        git("commit", "-m", message)

        print("\nCOMMIT_CREATED")
        print(f"Rama: {branch}")
        print(f"Mensaje: {message}")
        print(f"Commit: {git('rev-parse', '--short', 'HEAD')}")
        print("\nNo se ha realizado push ni merge.")

    except (RuntimeError, ValueError, OSError) as error:
        sys.exit(f"\nBLOCKED: {error}")


if __name__ == "__main__":
    main()
