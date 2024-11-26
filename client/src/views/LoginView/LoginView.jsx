import { FormularioLogin } from '../../components/FomularioLogin/FormularioLogin';
import './LoginView.css'

function LoginView() {
  return (
    <div className='login-container '>
      <div className="left-section">
        <h1>Optainer</h1>
      </div>
      <FormularioLogin />
    </div>
  );
}

export default LoginView;
