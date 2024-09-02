# Optainer 

Optainer es una solución web diseñada para optimizar la gestión y organización de contenedores en almacenes extraportuarios. Este proyecto utiliza un stack moderno, incluyendo React, Node.js, Express, MongoDB y Three.js, para ofrecer una plataforma eficiente y segura que facilita el control y seguimiento de operaciones logísticas, con visualización 3D de la disposición de los contenedores.

## Índice

- [Introducción](#introducción)
- [Características](#características)
- [Prerrequisitos](#prerrequisitos)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)

## Introducción

Optainer fue creado para abordar los desafíos en la organización y seguimiento de contenedores dentro de almacenes extraportuarios. La aplicación permite a los operadores gestionar contenedores en tiempo real, visualizar la disposición en 3D mediante Three.js, y asegurar la integridad de los datos mediante un backend robusto basado en Express y MongoDB.

## Características

- **Gestión de contenedores**: Control y organización en tiempo real.
- **Visualización 3D**: Interfaz gráfica para ver la disposición de contenedores.
- **Conexión a MongoDB**: Manejo seguro y eficiente de datos.
- **Diseño responsivo**: Adaptado para dispositivos móviles y tablets.

## Prerrequisitos

Asegúrate de tener lo siguiente instalado en tu entorno de desarrollo:

- Node.js (v14 o superior)
- npm o yarn
- MongoDB
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

4. Inicia el servidor:
    ```bash
    cd server && npm start
    ```

5. Inicia la aplicación cliente:
    ```bash
    cd client && npm start
    ```

## Estructura del Proyecto

La estructura básica del proyecto es la siguiente:

```plaintext
optainer-management/
├── client/              # Código fuente del frontend (React)
│   ├── public/
│   └── src/
│       ├── components/  # Componentes React
│       ├── assets/      # Archivos estáticos (imágenes, etc.)
│       ├── styles/      # Archivos CSS
│       ├── App.js
│       └── index.js
├── server/              # Código fuente del backend (Node.js, Express)
│   ├── config/          # Configuración de MongoDB y variables de entorno
│   ├── controllers/     # Controladores para la lógica de la API
│   ├── models/          # Modelos de datos de MongoDB
│   ├── routes/          # Rutas de la API
│   ├── utils/           # Utilidades y middleware
│   └── index.js         # Punto de entrada del servidor
├── threejs/             # Archivos relacionados con Three.js para la visualización 3D
│   ├── scenes/          # Escenas 3D
│   ├── objects/         # Modelos y objetos 3D
│   ├── controls/        # Controles de la cámara y la escena
│   └── renderer.js      # Configuración del renderizador Three.js
├── .gitignore
├── README.md
└── package.json

