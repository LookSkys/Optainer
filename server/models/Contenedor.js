// models/Contenedor.js
const mongoose = require('mongoose');

const contenedorSchema = new mongoose.Schema({
    contenedor: { type: String, required: true },
    ubicacion: { type: String, required: true },
    zona: { type: String, required: true },
    visado: { type: Boolean, required: true },
    condicion: { type: String, required: true },
    estadoPapeleta: { type: String, required: true },
    papeletaRecepcion: { type: Number, required: true },
    fechaRecepcion: { type: String, required: true },
    diasAlmacen: { type: Number, required: true },
    tipoMov: { type: String, required: true },
    sentidoOperacion: { type: String, required: true },
    nroDocumento: { type: String, required: true },
    mfto: { type: Number, required: true },
    blMaster: { type: String, required: true },
    consigExpoImpo: { type: String, required: true },
    nave: { type: String, required: true },
    tipoContenedor: { type: String, required: true },
}, { collection: 'contenedores' }); // Asegúrate de que sea 'contenedores'

module.exports = mongoose.model('Contenedor', contenedorSchema);
