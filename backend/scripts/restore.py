from scripts.utils import DB_CONFIG, BACKUP_DIR, get_mysql_command, logger, ENVIRONMENT
import subprocess
import os


def list_backups():
    return sorted(BACKUP_DIR.glob("backup_*.sql"), reverse=True)


def choose_backup(backups):
    print("\nBackups disponibles:\n")

    for i, file in enumerate(backups, start=1):
        print(f"[{i}] {file.name}")

    print()

    while True:
        try:
            choice = int(input("Seleccione el backup a restaurar: "))
            if 1 <= choice <= len(backups):
                return backups[choice - 1]
        except ValueError:
            pass

        print("Selección inválida. Intente nuevamente.")


def restore_backup(backup_file):

    mysql = get_mysql_command("mysql")

    env = os.environ.copy()
    env["MYSQL_PWD"] = DB_CONFIG["password"]

    command = [
        mysql,
        "-h", DB_CONFIG["host"],
        "-P", str(DB_CONFIG["port"]),
        "-u", DB_CONFIG["user"],
        DB_CONFIG["name"],
    ]

    print("\nRestaurando backup...\n")

    with open(backup_file, "r", encoding="utf-8") as input_file:
        result = subprocess.run(
            command,
            stdin=input_file,
            stderr=subprocess.PIPE,
            env=env,
            text=True,
        )

    if result.returncode == 0:
        print("Restore completado correctamente.")
        logger.info(f"Restore ejecutado: {backup_file.name}")
    else:
        print("Error al restaurar:\n")
        print(result.stderr)
        logger.error(result.stderr)

def confirm_restore(file_name):
    print("\n⚠ ATENCIÓN")
    print("Este proceso sobrescribirá la base de datos actual.")
    print(f"Backup seleccionado: {file_name}\n")

    confirm = input("¿Continuar? (s/N): ").strip().lower()

    return confirm == "s"

def main():
    backups = list_backups()

    if not backups:
        print("No hay backups disponibles.")
        return

    if ENVIRONMENT == "production":
        print("❌ Restore deshabilitado en producción.")
        logger.warning("Intento de restore en producción bloqueado")
        return

    selected = choose_backup(backups)

    if not confirm_restore(selected.name):
        print("Restore cancelado.")
        return

    restore_backup(selected)


if __name__ == "__main__":
    main()