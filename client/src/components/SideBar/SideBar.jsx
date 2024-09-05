import React from 'react';
import './Sidebar.css'; 

// SIDEBAR es El componente que hará de cuadro para filtrar en el mapa general
const Sidebar = () => {
  return (
    <div className="sidebar">
      <button>Filtrar</button>
      <button>Vista Avanzada</button>
      
      {/* Filtro de contenedores */}
      <div className="search-bar">
        <h6>Ingrese ID:</h6>
        <input type="text" placeholder="Ej: HLXU-123456-7" />
        <button>Buscar</button>
      </div>
    </div>
  );
};

export default Sidebar;
