// routes/contenedorRoutes.js
const express = require('express');
const { getContenedores, addContenedor, removeContenedor } = require('../controllers/dataContenedor.js'); // Importar el controlador

const router = express.Router();

module.exports = (io) => {
    // Pasamos `io` a los controladores para que puedan emitir eventos
    router.get('/contenedores', getContenedores);
    router.post('/contenedores', (req, res) => addContenedor(req, res, io));  // Pasar `io` al controlador de agregar
    router.delete('/contenedores/:id', (req, res) => removeContenedor(req, res, io));  // Pasar `io` al controlador de eliminar
    
    return router;
  };
