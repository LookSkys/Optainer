import { useState } from 'react';
import { FaSignOutAlt, FaBars } from 'react-icons/fa';
import { FaHouse, FaBox, FaWrench, FaClipboardCheck, FaFileInvoiceDollar} from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import './SideBarLateral.css'; // Asegúrate de tener el CSS adecuado

function SideBarLateral() {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  return (
    <div className={`sidebar-lateral ${isActive ? 'is-active' : ''}`}>
      <div className="hamburger-button" onClick={handleToggle}>
        <FaBars />
      </div>

      {isActive && (
        <aside className="menu">
          <div className="top-buttons">
            <button className="icon-button" onClick={() => navigate('/home')}><FaHouse /></button>
            <button className="icon-button" onClick={() => navigate('/metricas')}><FaFileInvoiceDollar /></button>
            <button className="icon-button" onClick={() => navigate('/avanzado')}><FaBox /></button>
            <button className="icon-button" onClick={() => navigate('/')}><FaClipboardCheck /></button>
            <button className="icon-button" onClick={() => navigate('/')}><FaWrench /></button>
          </div>

          <div className="bottom-buttons">
            <div className='divider'></div>
            <button className="icon-button" onClick={() => navigate('/')}><FaSignOutAlt /></button>
          </div>
        </aside>
      )}
    </div>
  );
}

export default SideBarLateral;
