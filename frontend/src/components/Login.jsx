import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 1. Importamos useNavigate
import '../index.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate(); // 2. Inicializamos el navegador interno

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login con:', formData);
        
        // 3. Simulamos un login exitoso y redirigimos al home
        navigate('/home'); 
    };

    return (
        <div className="register-wrapper">
            <div className="login-info-panel">
                <h1>Vuelve a tu<br/>sala de<br/>escucha.</h1>
                <p>Inicia sesión para sincronizar tu actividad.</p>
                <div className="stats-container">
                    <div className="stat-pill">128 playlists</div>
                    <div className="stat-pill">42 artistas</div>
                </div>
            </div>

            <div className="form-panel">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Correo electrónico</label>
                        <input type="email" name="email" className="custom-input" onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Contraseña</label>
                        <input type="password" name="password" className="custom-input" onChange={handleChange} required />
                    </div>
                    <button type="submit" className="submit-btn">Entrar →</button>
                    <div className="login-link">
                        ¿No tienes cuenta? <Link to="/registro"><span>Crear registro</span></Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;