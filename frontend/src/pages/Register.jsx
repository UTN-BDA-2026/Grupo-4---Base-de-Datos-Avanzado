import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthBackground from '../components/AuthBackground';
import FormInput from '../components/FormInput';
import ErrorMessage from '../components/ErrorMessage';
import '../index.css';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', password2: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register(formData); // 👈 se pasa el objeto completo, no campos sueltos
            navigate('/home');
        } catch (err) {
            const errors = err.response?.data;
            const msg = errors
                ? Object.values(errors).flat().join(' ')
                : 'Error al registrarse';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="saas-container">
            <AuthBackground />

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

                        <ErrorMessage message={error} />

                        <form onSubmit={handleSubmit}>
                            <FormInput label="Nombre visible" name="username" onChange={handleChange} />
                            <FormInput label="Email" type="email" name="email" onChange={handleChange} />
                            <FormInput label="Contraseña" type="password" name="password" onChange={handleChange} />
                            <FormInput label="Repetir contraseña" type="password" name="password2" onChange={handleChange} />

                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? 'Creando cuenta...' : 'Registrarme →'}
                            </button>

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