import './App.css'
import Card from './components/Card'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './components/navigation/Navbar'
import ThreeMap from './components/ThreeMap' //mapa del patio de contenedores
import Sidebar from './components/SideBar/SideBar' //cuadro para filtrar en mapa general
import MapaView from './views/MapaView'
import InventarioView from './views/InventarioView'
import MovimientosView from './views/MovimientosView'
import MetricasView from './views/MetricasView'


function App() {

  return (
    <div className='App'>
      <Navbar />
      <Routes>
        <Route path='/' element={<MapaView />} />
        <Route path='/inventario' element={<InventarioView />} />
        <Route path='/movimientos' element={<MovimientosView />} />
        <Route path='/metricas' element={<MetricasView />} />
      </Routes>
      <Sidebar />
      <ThreeMap /> 
    </div>
  )
}

export default App
