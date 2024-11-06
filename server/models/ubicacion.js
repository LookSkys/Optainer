// models/Ubicacion.js
const mongoose = require('mongoose');

const ubicacionSchema = new mongoose.Schema({
    Contenedor: String,
    Ubicación: String,
    Zona: String,
    Visado: Boolean,
});

module.exports = mongoose.model('Ubicacion', ubicacionSchema);