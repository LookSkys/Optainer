import { useState } from 'react';
import { FaSignOutAlt, FaBars, FaTasks } from 'react-icons/fa';
import { FaHouse, FaBox } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import './SideBarLateral.css';

function SideBarLateral() {
  const [isActive, setIsActive] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null); // Estado para el hover
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const handleMouseEnter = (label) => {
    setHoveredButton(label);
  };

  const handleMouseLeave = () => {
    setHoveredButton(null);
  };

  return (
    <div className={`sidebar-lateral ${isActive ? 'is-active' : ''}`}>
      <div className="hamburger-button" onClick={handleToggle}>
        <FaBars />
      </div>

      {isActive && (
        <aside className="menu">
          <div className="top-buttons">
            <div className="icon-wrapper">
              <button
                className="icon-button"
                onClick={() => navigate('/home')}
                onMouseEnter={() => handleMouseEnter('Home')}
                onMouseLeave={handleMouseLeave}
              >
                <FaHouse />
              </button>
              {hoveredButton === 'Home' && <div className="label">Home</div>}
            </div>

            <div className="icon-wrapper">
              <button
                className="icon-button"
                onClick={() => navigate('/avanzado')}
                onMouseEnter={() => handleMouseEnter('Avanzado')}
                onMouseLeave={handleMouseLeave}
              >
                <FaBox />
              </button>
              {hoveredButton === 'Avanzado' && <div className="label">Avanzado</div>}
            </div>

            <div className="icon-wrapper">
              <button
                className="icon-button"
                onClick={() => navigate('/tareas')}
                onMouseEnter={() => handleMouseEnter('Tareas')}
                onMouseLeave={handleMouseLeave}
              >
                <FaTasks />
              </button>
              {hoveredButton === 'Tareas' && <div className="label">Tareas</div>}
            </div>           

          </div>

          

          <div className="bottom-buttons">
            <div className="divider"></div>
            <div className="icon-wrapper">
              <button
                className="icon-button"
                onClick={() => navigate('/')}
                onMouseEnter={() => handleMouseEnter('Salir')}
                onMouseLeave={handleMouseLeave}
              >
                <FaSignOutAlt />
              </button>
              {hoveredButton === 'Salir' && <div className="label">Salir</div>}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

export default SideBarLateral;
