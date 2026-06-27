# Grupo-4---Base-de-Datos-Avanzado

---

### Integrantes:
* **Celeste Choquevillca**
* **Gabriela Chang Yang**
* **Victoria Sanchez Bujaldon**

---

# MusicHub - Plataforma de Gestión y Consulta de Información Musical

## Descripción

MusicHub es una aplicación web desarrollada como Trabajo Final para la materia **Base de Datos Avanzada**.

La plataforma permite buscar, consultar y gestionar información musical utilizando datos provenientes de la API de Deezer junto con una base de datos local en MySQL. Además, los usuarios pueden registrarse, iniciar sesión, administrar playlists personales y consultar información de artistas, álbumes y canciones.

El proyecto fue desarrollado aplicando distintos conceptos vistos durante la cursada, priorizando el rendimiento, la integridad de los datos y las buenas prácticas de desarrollo.

---

# Funcionalidades

- Registro de usuarios
- Inicio de sesión mediante JWT
- Búsqueda de canciones
- Búsqueda de artistas
- Consulta de álbumes
- Gestión de playlists
- Historial de reproducciones
- Consulta de información desde Deezer
- Caché mediante Redis

---

# Temas de Base de Datos implementados

El proyecto implementa los siguientes conceptos de la materia:

- Índices personalizados
- Transacciones
- Seguridad
- ORM (Django ORM)
- NoSQL mediante Redis
- Backup & Restore

---

# Tecnologías utilizadas

## Backend

- Python
- Django
- Django REST Framework
- MySQL
- Redis
- JWT Authentication

## Frontend

- React
- Vite
- JavaScript
- CSS

## API externa

- Deezer API

---

# Cómo ejecutar el proyecto

## Clonar repositorio

```bash
git clone https://github.com/UTN-BDA-2026/Grupo-4---Base-de-Datos-Avanzado.git
```

---

## Backend

Entrar al directorio:

```bash
cd backend
```

Crear el entorno virtual:

```bash
python -m venv .venv
```

Activar el entorno virtual.

Instalar dependencias:

```bash
uv sync
```

Aplicar migraciones:

```bash
python manage.py migrate
```

Ejecutar servidor:

```bash
python manage.py runserver
```

---

## Frontend

Entrar al directorio:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

Ejecutar aplicación:

```bash
npm run dev
```

---

# Licencia

Este proyecto fue desarrollado con fines académicos para la materia **Base de Datos Avanzada**.