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
  const { contenedor, ubicacion, zona = '', visado = false } = req.body; // Extrae los datos del body, con valores por defecto

  try {
    const nuevaUbicacion = new Ubicacion({
      Contenedor: contenedor, 
      Ubicación: ubicacion,
      Zona: zona,
      Visado: visado
    });

    const savedUbicacion = await nuevaUbicacion.save(); // Guarda en la base de datos
    console.log(savedUbicacion); // Verifica que los datos se hayan guardado correctamente
    res.status(201).json({ message: 'Contenedor agregado a MongoDB', data: savedUbicacion });
  } catch (error) {
    console.error("Error al guardar en MongoDB:", error); // Log para diagnosticar el error
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
