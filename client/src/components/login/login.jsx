import { useNavigate } from 'react-router-dom'; // Importar useNavigate para la redirección
import './Login.css'; // Puedes ajustar los estilos en este archivo

function Login() {
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault(); 
    navigate('/home'); 
  };

  return (
    <div className="login-container">
      <div className="left-section">
        <h1>Optainer</h1>
      </div>
      <div className="right-section">
        <div className="login-box">
          <h2 style={{ color: 'white' }}>Inicio de Sesión</h2>
          <p>Bienvenido a la plataforma de gestión del patio de contenedores!!</p>
          <form onSubmit={handleLogin}>
            <label htmlFor="username">Nombre de Usuario:</label>
            <input type="text" id="username" name="username" placeholder="Ingrese su usuario" />

            <label htmlFor="password">Contraseña:</label>
            <input type="password" id="password" name="password" placeholder="Ingrese su contraseña" />

            <div className="forgot-password">
              <a href="/forgot-password">¿Olvidó su contraseña?</a>
            </div>

            <button type="submit">Iniciar Sesión</button> 
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

