const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const app = express();
const contenedorRoutes = require('./routes/contenedorRoutes');
const port = process.env.PORT || 5000;
const dotenv = require('dotenv');
dotenv.config({ path: './config.env'});
const http = require('http');
const { Server } = require('socket.io');

// Crear el servidor HTTP
const server = http.createServer(app);

// Crear una instancia de Socket.IO y pasarle el servidor HTTP
const io = new Server(server, {
  cors: {
    origin: '*', // Permitir todas las conexiones; configura el origen según sea necesario
  },
});

// Middleware para analizar JSON
app.use(express.json());

mongoose.connect(process.env.DB_CONNECTION)
  .then(connection => {
    console.log('Connected successfully')
  })
  .catch(console.log);

app.use(cors());

app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

app.use('/api', contenedorRoutes(io));

// Cualquier ruta que no sea un archivo estático debe devolver el index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
  });


// Configuración de Socket.IO para conexión de clientes
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  // Desconexión de cliente
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});  

server.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
