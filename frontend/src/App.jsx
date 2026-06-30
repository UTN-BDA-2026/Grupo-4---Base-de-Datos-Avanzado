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

                        <Route path="/home" element={
                            <ProtectedRoute>
                                <AppLayout><Home /></AppLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/perfil" element={
                            <ProtectedRoute>
                                <AppLayout><Profile /></AppLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/library" element={
                            <ProtectedRoute>
                                <AppLayout><Library /></AppLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/playlists/:id" element={
                            <ProtectedRoute>
                                <AppLayout><PlaylistDetail /></AppLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/buscar" element={
                            <ProtectedRoute>
                                <AppLayout><Search /></AppLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/cancion/:id" element={
                            <ProtectedRoute>
                                <AppLayout><TrackDetail /></AppLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/artist/:deezerId" element={
                            <ProtectedRoute>
                                <AppLayout><ArtistDetail /></AppLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/album/:deezerId" element={
                            <ProtectedRoute>
                                <AppLayout><AlbumDetail /></AppLayout>
                            </ProtectedRoute>
                        } />

                        <Route path="/" element={<Navigate to="/login" />} />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                </Router>
            </PlayerProvider>
        </AuthProvider>
    );
}

export default App;