import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // <-- Agregamos useNavigate
import '../index.css';

const HeadphonesIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>);
const MusicIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>);
const MailIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>);
const LockIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>);

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate(); // <-- Iniciamos la herramienta de navegación

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Iniciando sesión...');
        // ¡Acá ocurre la magia! Te manda directo al Home
        navigate('/home'); 
    };

    return (
        <div className="register-wrapper">
            <div className="login-info-panel">
                <div className="badge-dark"><HeadphonesIcon /> Acceso a Beats</div>
                <h1>Vuelve a tu<br/>sala de<br/>escucha.</h1>
                <p>Inicia sesión para sincronizar historial, playlists<br/>privadas y artistas favoritos desde tu backend en<br/>Django.</p>
                <div className="stats-container">
                    <div className="stat-pill">128 playlists</div>
                    <div className="stat-pill">42 artistas</div>
                    <div className="stat-pill">9.4k plays</div>
                </div>
            </div>

            <div className="form-panel">
                <div className="music-icon-box"><MusicIcon /></div>
                <h2>Login</h2>
                <p style={{ color: '#a3a3a3', fontSize: '14px', marginBottom: '30px' }}>Usa las credenciales de tu cuenta musical.</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Correo electrónico</label>
                        <div className="input-wrapper">
                            <span className="input-icon"><MailIcon /></span>
                            <input type="email" name="email" placeholder="ana@beats.local" onChange={handleChange} required className="custom-input" />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Contraseña</label>
                        <div className="input-wrapper">
                            <span className="input-icon"><LockIcon /></span>
                            <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required className="custom-input" />
                        </div>
                    </div>

                    <div className="options-row">
                        <label className="remember-me"><span className="custom-checkbox"></span> Recordarme</label>
                        <a className="recover-link">Recuperar acceso</a>
                    </div>

                    <button type="submit" className="submit-btn">Entrar <span>→</span></button>

                    <div className="login-link">
                        ¿No tienes cuenta? <Link to="/registro"><span>Crear registro</span></Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;