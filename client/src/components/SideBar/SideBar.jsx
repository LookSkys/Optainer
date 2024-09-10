import React from 'react';
import './Sidebar.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const Sidebar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light sidebar-custom flex-column">
      <div className="container-fluid">
        <button className='btn btn-outline-light mb-2 d-none d-lg-block'>Filtrar</button>
        <button className='btn btn-outline-light mb-2'>Vista Avanzada</button>
        
        {/* Filtro de contenedores */}
        <div className="search-bar mb-2">
          <h6>ID:</h6>
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Ej: HLXU-123456-7" />
            <button className="btn btn-dark">Buscar</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
