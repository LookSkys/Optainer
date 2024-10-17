import { useState } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'; // Importar iconos
import './ColorLegend.css'; // Archivo de estilos para este componente

const ColorLegend = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded); // Cambia el estado entre expandido y retraído
  };

  return (
    <div className="color-legend-container">
      <button className="toggle-button" onClick={toggleExpand}>
        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {isExpanded && (
        <div className="color-legend">
          <h4>Significado de los colores:</h4>
          <ul>
            <li><span className="color-box" style={{ backgroundColor: 'black' }}></span>Sin Espacios Disponibles</li>
            <li><span className="color-box" style={{ backgroundColor: 'red' }}></span>1 Espacio Disponible</li>
            <li><span className="color-box" style={{ backgroundColor: 'yellow' }}></span>2 Espacios Disponibles</li>
            <li><span className="color-box" style={{ backgroundColor: 'green' }}></span>3 Espacios Disponibles</li>
            <li><span className="color-box" style={{ backgroundColor: 'white' }}></span>4 Espacios Disponibles</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ColorLegend;
