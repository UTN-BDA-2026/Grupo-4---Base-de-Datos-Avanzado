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
        
        {}
        <Route path="/perfil" element={<Profile />} /> 
        
        {}
        <Route path="/" element={<Navigate to="/login" />} /> 
        
        {}
        <Route path="*" element={<Navigate to="/home" />} /> 
      </Routes>
    </Router>
  );
}

export default App;