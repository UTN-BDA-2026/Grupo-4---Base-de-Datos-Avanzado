import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../index.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/home'); 
    };

    return (
        <div className="saas-container">
            {/* Reutilizamos el fondo inmersivo del Home */}
            <div className="app-background"></div>
            <div className="glass-overlay"></div>

            {/* Espacio centrado para el formulario */}
            <div className="auth-workspace">
                <div className="register-wrapper">
                    
                    <div className="login-info-panel">
                        <div className="badge-dark">✧ Acceso seguro</div>
                        <h1>Vuelve a tu<br/>sala de<br/>escucha.</h1>
                        <p>Inicia sesión para sincronizar tu actividad y preferencias al instante.</p>
                        <div className="stats-container">
                            <div className="stat-pill">128 playlists</div>
                            <div className="stat-pill">42 artistas</div>
                        </div>
                    </div>

                    <div className="form-panel">
                        <div className="music-icon-box">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
                        </div>
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
                            
                            <div className="options-row">
                                <label className="remember-me">
                                    <input type="checkbox" style={{ accentColor: '#5eead4' }}/> Recordarme
                                </label>
                                <a href="#" className="recover-link">¿Olvidaste tu clave?</a>
                            </div>

                            <button type="submit" className="submit-btn">Entrar →</button>
                            
                            <div className="login-link">
                                ¿No tienes cuenta? <Link to="/registro"><span>Crear registro</span></Link>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;