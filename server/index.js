const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para analizar JSON
app.use(express.json());

// Conectar a MongoDB
mongoose.connect('your_mongodb_connection_string', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB conectado'))
.catch(err => console.log(err));

// Ruta básica
app.get('/', (req, res) => {
res.send('Servidor corriendo');
});

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
