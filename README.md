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

Para configurar y ejecutar Optainer localmente, sigue estos pasos:

### 1. Clonar el Repositorio

```bash
git clone https://github.com/LookSkys/Optainer.git
```

### 2. Configurar el Backend
#### Navegar a la carpeta del servidor:

```bash
cd server
```
#### Instalar las dependencias del servidor:

```bash
npm install
```
#### Iniciar el servidor:

```bash
node index.js
```
El servidor se ejecutará en http://localhost:5000.

### 3. Configurar el Frontend
#### Navegar a la carpeta del cliente:

```bash
cd ../client
```

#### Instalar las dependencias del cliente:

```bash
npm install
```
#### Iniciar la aplicación cliente:

```bash
npm run dev
```
La aplicación se ejecutará en http://localhost:3000.

## Estructura del Proyecto
La estructura básica del proyecto es la siguiente:
```plaintext
optainer/
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
├── .gitignore
└──  README.md
