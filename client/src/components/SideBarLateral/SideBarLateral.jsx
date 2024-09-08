// src/components/SideBarLateral.jsx
import React from 'react';
import { FaGlobeAmericas, FaListAlt, FaSignOutAlt, FaBars, FaBell  } from 'react-icons/fa'; // Importa los íconos
import './SideBarLateral.css'; // Estilos separados

function SideBarLateral() {
  return (
    <div className="sidebar-lateral">
      <div className="top-buttons">
        <button className="icon-button"><FaGlobeAmericas /></button>
        <button className="icon-button"><FaListAlt /></button>
        <button className="icon-button"><FaBell /></button>
      </div>
      <div className="bottom-buttons">
        <button className="icon-button"><FaBars /></button>
        <div className='divider'></div>
        <button className="icon-button"><FaSignOutAlt /></button>
      </div>
    </div>
  );
}

export default SideBarLateral;
