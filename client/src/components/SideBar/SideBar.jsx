import React from 'react';
import './Sidebar.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const Sidebar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light sidebar-custom space-between nav-justified">
      <div className="container-fluid d-flex justify-content-center align-items-center">
        {/* <button className='btn btn-outline-light mb-1 d-none d-lg-block'
          style={{ whiteSpace: 'nowrap', padding: '5px 10px', fontSize: '14px' }}
        >
          Filtrar
        </button> */}
        <button 
          className='btn btn-outline-light mb-1' 
          style={{ whiteSpace: 'nowrap', padding: '5px 10px', fontSize: '14px' }}
        >
          Vista Avanzada
        </button>
        
        {/* Filtro de contenedores */}
        <div className="input-group search-bar mb-1" style={{ width: 'auto', marginLeft: '10px' }}>
          <h6 className="me-2" style={{ marginBottom: '0', fontSize: '14px', marginTop: '10px'}}>ID:</h6>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Ej: HLXU-123456-7" 
            style={{ width: '500px', height: '38px', fontSize: '14px' }} 
          />
          <button 
            className="btn btn-dark ms-2" 
            style={{ padding: '5px 10px', fontSize: '14px' }}
          >
            Buscar
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
