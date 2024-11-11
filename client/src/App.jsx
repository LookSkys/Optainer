import { useEffect, useState } from 'react';
import io from 'socket.io-client'; // Importa socket.io-client
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import LoginView from './views/LoginView';
import Home from './views/Home';
import MapaAvanzadoView  from './views/MapaAvanzadoView'
import MetricasView from './views/MetricasView'
import SideBarLateral from './components/SideBarLateral/SideBarLateral'
import './App.css';

function App() {
  const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Establecer conexión con el servidor de WebSockets
        const socketConnection = io('https://backend-production-d707.up.railway.app'); 

        socketConnection.on('connect', () => {
          console.log('Conexión exitosa a WebSocket!');
        });
        
        setSocket(socketConnection);

        // Limpiar la conexión cuando el componente se desmonte
        return () => {
            socketConnection.disconnect();
            console.log('Desconectado del WebSocket');
        };
    }, []);

  return (
    <Router>
      <NavbarController />
      <Routes>
        <Route path="/" element={<LoginView />} />
        <Route path="/home" element={<Home />} />
        <Route path='/avanzado' element={<MapaAvanzadoView socket={socket} />} />
        <Route path='/metricas' element={<MetricasView/>} />
      </Routes>
    </Router>
  );
}

const NavbarController = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/' && <SideBarLateral/>}
    </>
  );
};

export default App;
