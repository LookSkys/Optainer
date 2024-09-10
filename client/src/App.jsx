import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './components/navigation/Navbar'
import Home from './views/Home'
import InventarioView from './views/InventarioView'
import MovimientosView from './views/MovimientosView'
import MetricasView from './views/MetricasView'
import SideBarLateral from './components/SideBarLateral/SideBarLateral'
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {

  return (
    <main>
      <Router>
        <div className= "d-none d-lg-block"><Navbar/></div>
        <div className='d-md-block d-lg-none'><SideBarLateral/></div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/inventario' element={<InventarioView/>} />
          <Route path='/movimientos' element={<MovimientosView/>} />
          <Route path='/metricas' element={<MetricasView/>} />
        </Routes>
      </Router>
    </main>


  
  )
}

export default App
