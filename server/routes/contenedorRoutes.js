// routes/contenedorRoutes.js
const express = require('express');
const { getContenedores } = require('../controllers/dataContenedor.js'); // Importar el controlador

const router = express.Router();

// Definir el endpoint de la API
router.get('/contenedores', getContenedores);

module.exports = router;
