import argparse

from scripts.backup import create_backup
from scripts.restore import main as restore_main


def main():
    parser = argparse.ArgumentParser(
        description="Herramientas de administración de la base de datos."
    )

    subparsers = parser.add_subparsers(
        dest="command",
        help="Comandos disponibles"
    )

    subparsers.add_parser(
        "backup",
        help="Genera un backup de la base de datos."
    )

    subparsers.add_parser(
        "restore",
        help="Restaura un backup de la base de datos."
    )

    args = parser.parse_args()

    if args.command == "backup":
        create_backup()

    elif args.command == "restore":
        restore_main()

    else:
        parser.print_help()


if __name__ == "__main__":
    main()