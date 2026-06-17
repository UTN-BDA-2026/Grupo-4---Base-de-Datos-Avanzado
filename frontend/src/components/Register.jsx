import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../index.css';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/home');
    };

    return (
        <div className="saas-container">
            <div className="app-background"></div>
            <div className="glass-overlay"></div>

            <div className="auth-workspace">
                <div className="register-wrapper">
                    
                    <div className="info-panel">
                        <span className="badge">✧ Nueva cuenta</span>
                        <h1>Crea tu<br/>identidad<br/>sonora.</h1>
                        <p>Conecta tus gustos con historial y recomendaciones generadas por IA.</p>
                        
                        <div className="feature-item">
                            <span style={{color: '#5eead4'}}>✓</span> Sincronización en tiempo real
                        </div>
                        <div className="feature-item">
                            <span style={{color: '#5eead4'}}>✓</span> Playlists generativas
                        </div>
                        <div className="feature-item">
                            <span style={{color: '#5eead4'}}>✓</span> Analíticas de escucha
                        </div>
                    </div>

                    <div className="form-panel">
                        <h2>Crear cuenta</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Nombre visible</label>
                                <input type="text" name="username" className="custom-input" onChange={handleChange} required />
                            </div>
                            <div className="input-group">
                                <label>Email</label>
                                <input type="email" name="email" className="custom-input" onChange={handleChange} required />
                            </div>
                            <div className="input-group">
                                <label>Contraseña</label>
                                <input type="password" name="password" className="custom-input" onChange={handleChange} required />
                            </div>
                            
                            <button type="submit" className="submit-btn">Registrarme →</button>
                            
                            <div className="login-link">
                                ¿Ya tienes cuenta? <Link to="/login"><span>Ir a login</span></Link>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Register;