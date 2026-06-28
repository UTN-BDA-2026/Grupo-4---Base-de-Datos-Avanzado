from scripts.utils import DB_CONFIG, BACKUP_DIR, get_mysql_command
from scripts.utils import logger
from datetime import datetime
import subprocess
import os
import time


def create_backup():
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    backup_file = BACKUP_DIR / f"backup_{timestamp}.sql"

    env = os.environ.copy()
    env["MYSQL_PWD"] = DB_CONFIG["password"]

    mysqldump = get_mysql_command("mysqldump")
    start_time = time.perf_counter()

    command = [
        mysqldump,
        "-h", DB_CONFIG["host"],
        "-P", str(DB_CONFIG["port"]),
        "-u", DB_CONFIG["user"],
        DB_CONFIG["name"],
    ]

    print("Generando backup...")

    with open(backup_file, "w", encoding="utf-8", errors="ignore") as output:
        result = subprocess.run(
            command,
            stdout=output,
            stderr=subprocess.PIPE,
            env=env,
            text=True,
        )

    elapsed_time = time.perf_counter() - start_time

    if result.returncode == 0:
        print("\nBackup generado correctamente.")
        print(f"Archivo: {backup_file}")
        size_mb = backup_file.stat().st_size / (1024 * 1024)
        print("\n========================================")
        print("Backup generado correctamente")
        print(f"Archivo   : {backup_file.name}")
        print(f"Ubicación : {BACKUP_DIR}")
        print(f"Tamaño    : {size_mb:.2f} MB")
        print(f"Tiempo    : {elapsed_time:.2f} s")
        print("========================================")
    else:
        print("\nError al generar el backup:\n")
        print(result.stderr)
        logger.error(result.stderr)


if __name__ == "__main__":
    create_backup()