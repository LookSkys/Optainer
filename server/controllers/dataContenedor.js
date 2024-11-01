// Controlador para obtener los datos de los contenedores
// controllers/dataController.js
const Ubicacion = require('../models/ubicacion');

const getContenedores = async (req, res) => {
  try {
    const ubicaciones = await Ubicacion.find(); // Obtiene todas las ubicaciones
    const filteredData = ubicaciones.map((ubicacion) => ({
        contenedor: ubicacion.Contenedor,
        ubicacion: ubicacion.Ubicación,
        zona: ubicacion.Zona,
        visado: ubicacion.Visado,
    }));
    res.json(filteredData);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los datos de MongoDB' });
  }
};

const addContenedor = async (req, res) => {
    const { contenedor, ubicacion } = req.body;
  
    try {
      const nuevaUbicacion = new Ubicacion({
        Contenedor: contenedor,
        Ubicacion: ubicacion,
        Zona: '',
        Visado: '',
      });
  
      await nuevaUbicacion.save(); // Guarda la nueva ubicación en MongoDB
      res.status(201).json({ message: 'Contenedor agregado a MongoDB' });
    } catch (error) {
      res.status(500).json({ error: 'Error al agregar el contenedor en MongoDB' });
    }
  };
  

  const removeContenedor = async (req, res) => {
    const { id } = req.params;
  
    try {
      await Ubicacion.findByIdAndDelete(id); // Elimina la ubicación por ID
      res.json({ message: 'Contenedor eliminado de MongoDB' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el contenedor en MongoDB' });
    }
  };
  

module.exports = {
    getContenedores,
    addContenedor,
    removeContenedor,
};
