import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Registro con:', formData);
    };

    return (
        <div className="register-wrapper">
            <div className="info-panel">
                <h1>Crea tu<br/>identidad<br/>sonora.</h1>
                <p>Conecta tus gustos con historial y recomendaciones.</p>
            </div>

            <div className="form-panel">
                <h2>Crear cuenta</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Nombre de Usuario</label>
                        <input type="text" name="username" className="custom-input" onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Email</label>
                        <input type="email" name="email" className="custom-input" onChange={handleChange} required />
                    </div>
                    
                    {/* Aquí agregamos el campo de la contraseña */}
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
    );
};

export default Register;