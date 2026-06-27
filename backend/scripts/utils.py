import os
import shutil
import logging
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / ".env")

DB_CONFIG = {
    "name": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "host": os.getenv("DB_HOST"),
    "port": os.getenv("DB_PORT"),
}

MYSQL_BIN = os.getenv("MYSQL_BIN")

BACKUP_DIR = BASE_DIR / "backups"
LOG_DIR = BASE_DIR / "logs"

BACKUP_DIR.mkdir(exist_ok=True)
LOG_DIR.mkdir(exist_ok=True)


def get_mysql_command(command_name: str) -> str:
    """
    Devuelve la ruta del ejecutable de MySQL.

    Prioridad:
    1. MYSQL_BIN del archivo .env
    2. PATH del sistema operativo
    """

    executable = f"{command_name}.exe" if os.name == "nt" else command_name

    if MYSQL_BIN:
        candidate = Path(MYSQL_BIN) / executable
        if candidate.exists():
            return str(candidate)

    command = shutil.which(command_name)

    if command:
        return command

    raise FileNotFoundError(
        f"No se encontró '{command_name}'.\n\n"
        "Soluciones posibles:\n"
        "1. Configurar MYSQL_BIN en el archivo .env.\n"
        "2. Agregar MySQL Server al PATH del sistema."
    )



logger = logging.getLogger("backup_restore")
logger.propagate = False

if not logger.handlers:
    logger.setLevel(logging.INFO)

    log_file = LOG_DIR / "django.log"

    handler = logging.FileHandler(log_file, encoding="utf-8")

    formatter = logging.Formatter(
        "%(asctime)s - %(levelname)s - %(message)s"
    )

    handler.setFormatter(formatter)

    logger.addHandler(handler)