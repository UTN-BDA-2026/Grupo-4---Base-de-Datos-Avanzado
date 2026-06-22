import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import PlayerBar from '../components/PlayerBar';
import LogoutModal from '../components/LogoutModal';
import api from '../services/api';
import '../index.css';

const Playlists = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    
    const [playlists, setPlaylists] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [name, setName] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    
    const [toastMessage, setToastMessage] = useState('');
    const [playlistToDelete, setPlaylistToDelete] = useState(null);

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const fetchPlaylists = async () => {
        try {
            const { data } = await api.get('/playlists/');
            setPlaylists(Array.isArray(data) ? data : []);
        } catch (error) {
            setPlaylists([]);
        }
    };

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(''), 3000);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        try {
            await api.post('/playlists/', { name: name });
            setName('');
            setIsCreating(false);
            fetchPlaylists(); 
            showToast('Playlist creada con éxito.');
        } catch (error) {
            const backendError = error.response?.data;
            const errorMessage = backendError 
                ? typeof backendError === 'object' ? JSON.stringify(backendError) : backendError 
                : 'Error de conexión con el servidor.';
            setErrorMsg(`Detalle: ${errorMessage}`);
        }
    };

    const confirmDelete = (e, id) => {
        e.stopPropagation();
        setPlaylistToDelete(id);
    };

    const executeDelete = async () => {
        if (!playlistToDelete) return;
        try {
            await api.delete(`/playlists/${playlistToDelete}/`);
            setPlaylistToDelete(null);
            fetchPlaylists();
            showToast('Playlist eliminada correctamente.');
        } catch (error) {
            setPlaylistToDelete(null);
            showToast('Error al eliminar la playlist.');
        }
    };

    const handleUpdate = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await api.put(`/playlists/${id}/`, { name: editName });
            setEditingId(null); 
            fetchPlaylists(); 
            showToast('Playlist actualizada.');
        } catch (error) {
            showToast('Error al actualizar la playlist.');
        }
    };

    const handleLogoutConfirm = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="saas-container">
            <div className="app-background"></div>
            <div className="glass-overlay"></div>

            {toastMessage && (
                <div style={{
                    position: 'fixed', top: '30px', left: '50%', transform: 'translateX(-50%)',
                    backgroundColor: '#5eead4', color: 'black', padding: '12px 24px', 
                    borderRadius: '50px', fontWeight: '600', fontSize: '0.95rem',
                    boxShadow: '0 10px 30px rgba(94, 234, 212, 0.3)', zIndex: 10000,
                    animation: 'fadeIn 0.3s ease'
                }}>
                    ✓ {toastMessage}
                </div>
            )}

            <div className="saas-workspace">
                <Sidebar user={user} onLogoutClick={() => setShowLogoutModal(true)} />

                <main className="saas-main-panel">
                    <div className="saas-content-scroll">
                        <div className="content-wrapper" style={{ textAlign: 'left', padding: '2rem 3rem', maxWidth: '1200px', margin: '0' }}>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                <div>
                                    <h1 className="saas-title" style={{ margin: 0, fontSize: '2.5rem', letterSpacing: '-1px' }}>Mi Biblioteca</h1>
                                    <span style={{ color: '#9ca3af', fontSize: '1rem', marginTop: '5px', display: 'block' }}>✧ Tu Colección Sonora</span>
                                </div>
                                <button 
                                    className="submit-btn" 
                                    style={{ width: 'auto', padding: '0.8rem 1.5rem', margin: 0, borderRadius: '50px', fontSize: '0.9rem' }}
                                    onClick={() => { setIsCreating(true); setEditingId(null); }}
                                >
                                    Nueva playlist +
                                </button>
                            </div>

                            <section className="feed-section" style={{ width: '100%' }}>
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
                                    gap: '20px',
                                    width: '100%'
                                }}>
                                    
                                    <div 
                                        onClick={() => navigate(`/playlists/likes`)} 
                                        style={{ 
                                            backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px', padding: '20px',
                                            cursor: 'pointer', position: 'relative', transition: 'all 0.3s ease', border: '1px solid rgba(255, 255, 255, 0.05)',
                                            width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '12px'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.07)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'}
                                    >
                                        <div style={{ 
                                            width: '100%', aspectRatio: '1/1', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', 
                                            borderRadius: '8px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' 
                                        }}>
                                            <span style={{ fontSize: '3rem', color: 'white' }}>♥</span>
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <h3 style={{ margin: '0', color: 'white', fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Me gusta</h3>
                                            <p style={{ margin: '5px 0', color: '#9ca3af', fontSize: '0.85rem' }}>Por Ti</p>
                                        </div>
                                    </div>

                                    {playlists
                                        .filter((pl) => pl.name.toLowerCase() !== 'me gusta')
                                        .map((pl) => (
                                        <div 
                                            key={pl.id} 
                                            onClick={() => navigate(`/playlists/${pl.id}`)} 
                                            style={{ 
                                                backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px', padding: '20px',
                                                cursor: 'pointer', position: 'relative', transition: 'all 0.3s ease', border: '1px solid rgba(255, 255, 255, 0.05)',
                                                width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '12px'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.07)'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'}
                                        >
                                            <div style={{ 
                                                width: '100%', aspectRatio: '1/1', background: 'linear-gradient(135deg, #5eead4, #8b5cf6)', 
                                                borderRadius: '8px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' 
                                            }}>
                                                <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '5px' }}>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setEditingId(pl.id); setEditName(pl.name); }}
                                                        style={{ background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', cursor: 'pointer', padding: '6px', borderRadius: '50%', fontSize: '0.9rem' }}
                                                    >✎</button>
                                                    <button 
                                                        onClick={(e) => confirmDelete(e, pl.id)}
                                                        style={{ background: 'rgba(0,0,0,0.5)', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: '6px', borderRadius: '50%', fontSize: '0.9rem' }}
                                                    >🗑</button>
                                                </div>
                                            </div>

                                            {editingId === pl.id ? (
                                                <form onSubmit={(e) => handleUpdate(e, pl.id)} onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: '5px' }}>
                                                    <input type="text" value={editName} className="custom-input" onChange={(e) => setEditName(e.target.value)} required autoFocus style={{ flex: 1, padding: '5px', fontSize: '0.9rem', marginBottom: 0, minWidth: 0 }} />
                                                    <button type="submit" className="submit-btn" style={{ padding: '5px 10px', margin: 0 }}>✔</button>
                                                </form>
                                            ) : (
                                                <div style={{ minWidth: 0 }}>
                                                    <h3 style={{ margin: '0', color: 'white', fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pl.name}</h3>
                                                    <p style={{ margin: '5px 0', color: '#9ca3af', fontSize: '0.85rem' }}>Por {user?.username || 'Ti'}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>

                        </div>
                    </div>
                </main>
            </div>

            <PlayerBar track={{ title: 'De Música Ligera', artist: 'Soda Stereo' }} />
            <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={handleLogoutConfirm} />

            {isCreating && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(5px)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 9999, animation: 'fadeIn 0.2s ease'
                }}>
                    <div className="info-panel" style={{ width: '100%', maxWidth: '400px', border: '1px solid rgba(94, 234, 212, 0.3)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, color: 'white', fontSize: '1.5rem' }}>Crear Playlist</h2>
                            <button onClick={() => setIsCreating(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '1.5rem', cursor: 'pointer' }}>✖</button>
                        </div>
                        {errorMsg && <div style={{ color: '#ff6b6b', marginBottom: '15px', fontSize: '0.9rem', wordBreak: 'break-all' }}>{errorMsg}</div>}
                        <form onSubmit={handleCreate}>
                            <div className="input-group">
                                <label style={{ color: '#9ca3af', marginBottom: '8px', display: 'block' }}>Nombre de la playlist</label>
                                <input type="text" value={name} className="custom-input" onChange={(e) => setName(e.target.value)} required autoFocus placeholder="Ej: Frecuencias de Estudio" style={{ width: '100%', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
                                <button type="button" onClick={() => setIsCreating(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', color: '#9ca3af', cursor: 'pointer' }}>Cancelar</button>
                                <button type="submit" className="submit-btn" style={{ width: 'auto', margin: 0 }}>Crear</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {playlistToDelete && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(5px)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 9999, animation: 'fadeIn 0.2s ease'
                }}>
                    <div className="info-panel" style={{ width: '100%', maxWidth: '400px', backgroundColor: '#111', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '25px', textAlign: 'center' }}>
                        <h2 style={{ margin: '0 0 1rem 0', color: 'white', fontSize: '1.3rem' }}>¿Eliminar playlist?</h2>
                        <p style={{ color: '#9ca3af', marginBottom: '2rem', fontSize: '0.95rem' }}>Esta acción no se puede deshacer y borrará la colección de tu biblioteca.</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                            <button onClick={() => setPlaylistToDelete(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'transparent', color: 'white', cursor: 'pointer', transition: 'all 0.2s' }}>Cancelar</button>
                            <button onClick={executeDelete} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#ff6b6b', color: 'white', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}>Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
};

export default Playlists;