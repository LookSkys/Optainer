// controllers/dataController.js
const Contenedor = require('../models/Contenedor'); // Asegúrate de que estás importando el modelo Contenedor

// Controlador para obtener los datos de los contenedores desde MongoDB
const getContenedores = async (req, res) => {
    try {
        const contenedores = await Contenedor.find(); // Lee los datos de MongoDB, no del Excel
        res.json(contenedores); // Enviar los datos de los contenedores como respuesta
    } catch (error) {
        console.error('Error al obtener los contenedores desde MongoDB:', error);
        res.status(500).json({ error: 'Error al obtener los datos de MongoDB' });
    }
};

module.exports = {
    getContenedores,
};

