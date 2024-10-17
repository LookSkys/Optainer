import ThreeMap from '../components/ThreeMap'
import ColorLegend from '../components/ColorLegend/ColorLegend';
import 'bootstrap/dist/css/bootstrap.min.css'; 

const Home = () => {
  return (
    <div className="home-container">
      <section className="map-container">
        <div id="three-map">
          <ThreeMap />
        </div>
      </section>
    <ColorLegend/>
    </div>
  );
};

export default Home;

