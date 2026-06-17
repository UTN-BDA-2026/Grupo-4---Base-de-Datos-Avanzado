import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home'; // Agregamos la importación

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/home" element={<Home />} /> {/* Nueva ruta */}
        
        {/* Si entra a la raíz, lo mandamos al home o al login dependiendo de tu lógica */}
        <Route path="/" element={<Navigate to="/home" />} /> 
      </Routes>
    </Router>
  );
}

export default App;