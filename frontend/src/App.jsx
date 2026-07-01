import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Library from './pages/Library';
import PlaylistDetail from './pages/PlaylistDetail';
import Search from './pages/Search';
import TrackDetail from './pages/TrackDetail';
import ArtistDetail from './pages/ArtistDetail';
import AlbumDetail from './pages/AlbumDetail';

function App() {
    return (
        <AuthProvider>
            <PlayerProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/registro" element={<Register />} />
                        <Route element={
                            <ProtectedRoute>
                                <AppLayout />
                            </ProtectedRoute>
                        }>
                            <Route path="/home" element={<Home />} />
                            <Route path="/perfil" element={<Profile />} />
                            <Route path="/library" element={<Library />} />
                            <Route path="/playlists/:id" element={<PlaylistDetail />} />
                            <Route path="/buscar" element={<Search />} />
                            <Route path="/cancion/:id" element={<TrackDetail />} />
                            <Route path="/artist/:deezerId" element={<ArtistDetail />} />
                            <Route path="/album/:deezerId" element={<AlbumDetail />} />
                        </Route>

                        <Route path="/" element={<Navigate to="/login" />} />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                </Router>
            </PlayerProvider>
        </AuthProvider>
    );
}

export default App;