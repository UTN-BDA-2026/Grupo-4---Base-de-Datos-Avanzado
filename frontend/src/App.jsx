import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Playlists from './pages/Playlists';
import PlaylistDetail from './pages/PlaylistDetail';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />

          <Route path="/home" element={
            <ProtectedRoute><Home /></ProtectedRoute>
          } />
          
          <Route path="/perfil" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />

          {}
          <Route path="/playlists" element={
            <ProtectedRoute><Playlists /></ProtectedRoute>
          } />
          <Route path="/playlists/:id" element={
            <ProtectedRoute><PlaylistDetail /></ProtectedRoute>
          } />

          {}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;