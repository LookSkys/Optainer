# Optainer Management

Optainer Management es una solución web diseñada para optimizar la gestión y organización de contenedores en almacenes extraportuarios. Este proyecto utiliza un stack moderno, incluyendo React, Node.js, Express y PostgreSQL, para ofrecer una plataforma eficiente y segura que facilita el control y seguimiento de operaciones logísticas.

## Índice

- [Introducción](#introducción)
- [Características](#características)
- [Prerrequisitos](#prerrequisitos)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)

## Introducción

Optainer Management fue creado para abordar los desafíos en la organización y seguimiento de contenedores dentro de almacenes extraportuarios. La aplicación permite a los operadores gestionar contenedores en tiempo real, visualizar la disposición en 3D y asegurar la integridad de los datos mediante un backend robusto.

## Características

- **Gestión de contenedores**: Control y organización en tiempo real.
- **Visualización 3D**: Interfaz gráfica para ver la disposición de contenedores.
- **Autenticación segura**: Implementación de JWT para la seguridad.
- **Conexión a PostgreSQL**: Manejo seguro y eficiente de datos.
- **Diseño responsivo**: Adaptado para dispositivos móviles y tablets.

## Prerrequisitos

Asegúrate de tener lo siguiente instalado en tu entorno de desarrollo:

- Node.js (v14 o superior)
- npm o yarn
- PostgreSQL
- Git

## Instalación

Para configurar y ejecutar Optainer Management localmente, sigue estos pasos:

1. Clona el repositorio:
    ```bash
    git clone https://github.com/usuario/optainer-management.git
    ```

2. Instala las dependencias del servidor:
    ```bash
    cd server && npm install
    ```

3. Instala las dependencias del cliente:
    ```bash
    cd client && npm install
    ```

4. Configura las variables de entorno en un archivo `.env` en la carpeta `server`:
    ```env
    DB_HOST=localhost
    DB_USER=tu_usuario
    DB_PASS=tu_contraseña
    DB_NAME=optainer
    JWT_SECRET=tu_secreto
    PORT=5000
    ```

5. Inicia el servidor:
    ```bash
    cd server && npm start
    ```

6. Inicia la aplicación cliente:
    ```bash
    cd client && npm start
    ```

## Estructura del Proyecto

La estructura básica del proyecto es la siguiente:

```plaintext
optainer-management/
├── client/            # Código fuente del frontend (React)
│   ├── public/
│   └── src/
├── server/            # Código fuente del backend (Node.js, Express)
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── index.js
├── .gitignore
├── README.md
└── package.json

