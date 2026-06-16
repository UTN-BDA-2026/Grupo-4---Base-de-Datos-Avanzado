import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const CheckIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5eead4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>);
const UserIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const LockIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>);

const Register = () => {
    const [formData, setFormData] = useState({
        username: '', 
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Intentando registrar:', formData);
    };

    return (
        <div className="register-wrapper">
            <div className="info-panel">
                <span className="badge">Registro</span>
                <h1>Crea tu<br/>identidad<br/>sonora.</h1>
                <p>El perfil conecta tus gustos con historial, playlists, likes y recomendaciones generadas por artistas.</p>
                
                <div>
                    <div className="feature-item"><CheckIcon /> Sincronización con Django Auth</div>
                    <div className="feature-item"><CheckIcon /> Playlists privadas desde el primer acceso</div>
                    <div className="feature-item"><CheckIcon /> Historial listo para recomendaciones</div>
                </div>
            </div>

            <div className="form-panel">
                <h2>Crear cuenta</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Nombre visible</label>
                        <div className="input-wrapper">
                            <span className="input-icon"><UserIcon /></span>
                            <input type="text" name="username" placeholder="Ana Verde" onChange={handleChange} required className="custom-input" />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Email</label>
                        <div className="input-wrapper">
                            <span className="input-icon">@</span>
                            <input type="email" name="email" placeholder="ana@beats.local" onChange={handleChange} required className="custom-input" />
                        </div>
                    </div>

                    <div className="row">
                        <div className="input-group">
                            <label>Contraseña</label>
                            <div className="input-wrapper">
                                <span className="input-icon"><LockIcon /></span>
                                <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required className="custom-input" />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Confirmar</label>
                            <div className="input-wrapper">
                                <span className="input-icon"><LockIcon /></span>
                                <input type="password" name="confirmPassword" placeholder="••••••••" onChange={handleChange} required className="custom-input" />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="submit-btn">Registrarme <span>→</span></button>

                    <div className="login-link">
                        ¿Ya tienes cuenta? <Link to="/login"><span>Ir a login</span></Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;