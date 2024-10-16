import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import LoginView from './views/LoginView';
import Home from './views/Home';
import MapaAvanzadoView  from './views/MapaAvanzadoView'
import MetricasView from './views/MetricasView'
import SideBarLateral from './components/SideBarLateral/SideBarLateral'
import './App.css';

function App() {
  return (
    <Router>
      <NavbarController />
      <Routes>
        <Route path="/" element={<LoginView />} />
        <Route path="/home" element={<Home />} />
        <Route path='/avanzado' element={<MapaAvanzadoView/>} />
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
