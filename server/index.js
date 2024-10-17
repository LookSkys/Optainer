const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const app = express();
const contenedorRoutes = require('./routes/contenedorRoutes'); // Rutas de contenedores
const port = process.env.PORT || 5000;

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/optainer', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado a MongoDB');
}).catch(err => console.error('Error conectando a MongoDB', err));

// Middleware para analizar JSON
app.use(express.json());

app.use(cors());

// Rutas estáticas para el frontend
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

// Rutas de la API
app.use('/api', contenedorRoutes);

// Para cualquier otra ruta, sirve el archivo index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
