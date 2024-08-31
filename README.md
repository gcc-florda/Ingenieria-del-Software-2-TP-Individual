# Snap Message API

## Tabla de Contenido

1. [Introducción](#introducción)
2. [Desafíos del Proyecto](#desafíos-del-proyecto)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Endpoints](#endpoints)
5. [Pre-requisitos](#pre-requisitos)
6. [Testing](#testing)
7. [Comandos](#comandos)
8. [Probar los Endpoints](#probar-los-endpoints)

## Introducción

Esta es una API construida con Node.js y Express para manejar la crecion de SnapMsgs. La API incluye dos endpoints para crear y obtener mensajes (/snaps), y se despliega utilizando Docker Compose para gestionar el entorno y la base de datos PostgreSQL.

## Desafíos del Proyecto

El mayor desafío fue asegurar la correcta configuración del entorno Docker (Dockerfile y Docker Compose), especialmente la comunicación entre el contenedor de Node.js y la base de datos PostgreSQL. También fue complicado reemplazar la persistencia en memoria por la base de datos y manejar adecuadamente las variables de entorno.

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

- **`Dockerfile`**: Define la imagen de Docker para la aplicación Node.js.
- **`docker-compose.yml`**: Archivo que define y configura los servicios Docker, incluyendo la aplicación Node.js y la base de datos PostgreSQL.
- **`.env`**: Archivo que contiene las variables de entorno utilizadas en la configuración de la aplicación y la base de datos.
- **`app.js`**: Archivo principal que inicia el servidor Express, configura la base de datos, y define los endpoints.
- **`controllers/snapController.js`**: Procesa mensajes los cuales envia al servicio y devuelve errores.
- **`services/snapService.js`**: Contiene la lógica de negocio y funciones que interactúan con la base de datos para insertar y seleccionar mensajes Snap.
- **`database/index.js`**: Configura y gestiona las conexiones a la base de datos PostgreSQL, y contiene funciones para inicializar la base de datos y realizar consultas.

## Endpoints

### POST /snaps

Permite al usuario crear y publicar mensajes cortos (280 caracteres) en su feed.

### GET /snaps

Permite al usuario ver todos sus mensajes publicados.

## Pre-requisitos

Para levantar el entorno de desarrollo, es necesario contar con las siguientes herramientas:

- **Node.js**
- **NPM**
- **Docker**
- **Docker Compose**

Además, es necesario crear un archivo `.env` en la raíz del proyecto con las siguientes variables de entorno:

```bash
# App
HOST=0.0.0.0
PORT=8080
ENVIRONMENT='development'

# Database
DATABASE_HOST='postgres'
DATABASE_PORT=5432
DATABASE_NAME='snapdb'
DATABASE_USER='root'
DATABASE_PASSWORD=1234
```

## Testing

Este proyecto utiliza [Supertest](https://github.com/visionmedia/supertest) y [Jest](https://jestjs.io/) para realizar pruebas de integración de los endpoints.

Para correr los tests de integracion seguir los siguientes pasos:

#### Moverse a la branch `tests` y entrar en la carpeta `app`

```bash
git checkout tests

cd app
```

#### Ejecutar los tests con el siguiente comando

```bash
docker-compose run --rm node npm test
```

## Comandos

### Construir la imagen de Docker

```bash
docker-compose build

docker-compose up
```

## Probar los Endpoints

### POST /snaps

```bash
curl -X POST http://localhost:8080/snaps \
  -H "Content-Type: application/json" \
  -d '{"message": "Message 1"}'
```

### GET /snaps

```bash
curl http://localhost:8080/snaps
```
