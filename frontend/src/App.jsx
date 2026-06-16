// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para la pantalla de Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Ruta para la pantalla de Registro */}
        <Route path="/registro" element={<Register />} />
        
        {/* Si alguien entra a la raíz de la página, lo manda al login directo */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;