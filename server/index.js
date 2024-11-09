const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const app = express();
const contenedorRoutes = require('./routes/contenedorRoutes');
const port = process.env.PORT || 5000;
const dotenv = require('dotenv');
dotenv.config({ path: './config.env'});

// Middleware para analizar JSON
app.use(express.json());

mongoose.connect(process.env.DB_CONNECTION)
  .then(connection => {
    console.log('Connected successfully')
  })
  .catch(console.log);

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

app.use('/api', contenedorRoutes);

// Cualquier ruta que no sea un archivo estático debe devolver el index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
  });

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
