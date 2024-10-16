import ThreeMap from '../components/ThreeMap'
import 'bootstrap/dist/css/bootstrap.min.css'; 

const Home = () => {
  return (
    <div className="home-container">
      <section className="map-container">
        <div id="three-map">
          <ThreeMap />
        </div>
      </section>
    </div>
  );
};

export default Home;

