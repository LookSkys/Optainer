import { useEffect, useState } from 'react';
import ThreeMap from '../components/ThreeMap';
import ColorLegend from '../components/ColorLegend/ColorLegend';
import 'bootstrap/dist/css/bootstrap.min.css'; 

const Home = ({ socket }) => {
  const [showThreeMap, setShowThreeMap] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setShowThreeMap(false); // Oculta el mapa al salir de la vista
      } else {
        setTimeout(() => setShowThreeMap(true), 0); // Restaura el mapa al volver a la vista
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Limpieza del listener
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="home-container">
      <section className="map-container">
        <div id="three-map">
           {showThreeMap && <ThreeMap socket={socket}/>} {/* Monta o desmonta ThreeMap */}
        </div>
      </section>
      
      <ColorLegend />
    </div>
  );
};

export default Home;
