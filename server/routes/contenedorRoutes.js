// routes/contenedorRoutes.js
const express = require('express');
const { getContenedores, addContenedor, removeContenedor } = require('../controllers/dataContenedor.js'); // Importar el controlador

const router = express.Router();

// Definir el endpoint de la API
router.get('/contenedores', getContenedores);
router.post('/contenedores', addContenedor);  // Nueva ruta para agregar contenedor
router.delete('/contenedores/:id', removeContenedor);  // Nueva ruta para eliminar contenedor

module.exports = router;
