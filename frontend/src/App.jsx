import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Library from './pages/Library'
import PlaylistDetail from './pages/PlaylistDetail';
import Search from './pages/Search';
import TrackDetail from './pages/TrackDetail';
import ArtistDetail from './pages/ArtistDetail';
import AlbumDetail from './pages/AlbumDetail';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />

          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
          <Route path="/playlists/:id" element={<ProtectedRoute><PlaylistDetail /></ProtectedRoute>} />
          <Route path="/buscar" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/cancion/:id" element={<ProtectedRoute><TrackDetail /></ProtectedRoute>} />

          <Route path="/artist/:deezerId" element={<ProtectedRoute><ArtistDetail /></ProtectedRoute>} />
          <Route path="/album/:deezerId" element={<ProtectedRoute><AlbumDetail /></ProtectedRoute>} />

          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;