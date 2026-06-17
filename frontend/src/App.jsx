import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Profile from './components/Profile'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/home" element={<Home />} />
        
        {/* Aquí nos aseguramos de que la ruta sea exactamente "perfil" */}
        <Route path="/perfil" element={<Profile />} /> 
        
        {/* Si entras a la raíz, te manda al login */}
        <Route path="/" element={<Navigate to="/login" />} /> 
        
        {/* Si escribes cualquier otra cosa (ej: /Profile con mayúscula), te redirige al home para que la pantalla NUNCA quede negra */}
        <Route path="*" element={<Navigate to="/home" />} /> 
      </Routes>
    </Router>
  );
}

export default App;