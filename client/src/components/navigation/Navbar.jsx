import React from 'react';
import logo from '../../assets/logo.png'; // Ruta del logo de aexsa
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white"> 
      <div className="container-fluid">
        {/* Logo de aexsa*/}
        <a className="navbar-brand" href="#">
          <img src={logo} alt="Logo" style={{ height: '40px', width: '150px' }} />
        </a>

        {/* Botón de tipo hamburguesa para pantallas mas pequeñas */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Botones de las secciones de la pagina*/}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
            <Link className="nav-link" to="/">
                Mapa
              </Link>
            </li>
            <li className="nav-item">
            <Link className="nav-link" to="/inventario">
                Inventario
              </Link>
            </li>
            <li className="nav-item">
            <Link className="nav-link" to="/movimientos">
                Movimientos
              </Link>
            </li>
            <li className="nav-item">
            <Link className="nav-link" to="/metricas">
                Metricas
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" style={{ color: 'red' }}>
                Salir
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
