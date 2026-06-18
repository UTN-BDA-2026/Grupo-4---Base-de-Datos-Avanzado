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
    
    // Estados generales
    const [playlists, setPlaylists] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');

    // Estados para CREAR (Modal)
    const [isCreating, setIsCreating] = useState(false);
    const [name, setName] = useState('');

    // Estados para EDITAR (En la tarjeta)
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const fetchPlaylists = async () => {
        try {
            const { data } = await api.get('/playlists/');
            setPlaylists(data);
        } catch (error) {
            console.error("Error al cargar la biblioteca:", error);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        try {
            await api.post('/playlists/', { name: name, description: '' });
            setName('');
            setIsCreating(false);
            fetchPlaylists(); 
        } catch (error) {
            setErrorMsg('Error al crear la cápsula.');
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Frena el clic para que no te meta a la playlist
        const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar esta cápsula?");
        if (!confirmDelete) return;

        try {
            await api.delete(`/playlists/${id}/`);
            fetchPlaylists();
        } catch (error) {
            alert('Error al eliminar la playlist.');
        }
    };

    const handleUpdate = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await api.put(`/playlists/${id}/`, { name: editName, description: '' });
            setEditingId(null); 
            fetchPlaylists(); 
        } catch (error) {
            alert('Error al actualizar la playlist.');
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

            <div className="saas-workspace">
                <Sidebar user={user} onLogoutClick={() => setShowLogoutModal(true)} />

                <main className="saas-main-panel">
                    <div className="saas-content-scroll">
                        <div className="content-wrapper">
                            
                            {/* CABECERA */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <div>
                                    <h1 className="saas-title" style={{ margin: 0 }}>Mi Biblioteca</h1>
                                    <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>✧ Tu Colección Sonora</span>
                                </div>
                                <button 
                                    className="submit-btn" 
                                    style={{ width: 'auto', padding: '0.6rem 1.2rem', margin: 0, borderRadius: '50px' }}
                                    onClick={() => { setIsCreating(true); setEditingId(null); }}
                                >
                                    Nueva cápsula +
                                </button>
                            </div>

                            {/* LISTA DE PLAYLISTS (DISEÑO DE TARJETAS COMO EN TU IMAGEN) */}
                            <section className="feed-section">
                                {playlists.length === 0 ? (
                                    <p style={{ color: '#9ca3af' }}>Tu biblioteca está vacía. Crea tu primera cápsula arriba.</p>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
                                        {playlists.map((pl) => (
                                            <div 
                                                key={pl.id} 
                                                onClick={() => navigate(`/playlists/${pl.id}`)} 
                                                style={{ 
                                                    backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', padding: '15px',
                                                    cursor: 'pointer', position: 'relative', transition: 'all 0.2s ease', border: '1px solid rgba(255, 255, 255, 0.05)',
                                                    display: 'flex', flexDirection: 'column', gap: '12px'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'}
                                            >
                                                {/* Portada cuadrada (Gradiente por defecto) */}
                                                <div style={{ 
                                                    width: '100%', aspectRatio: '1/1', background: 'linear-gradient(135deg, #5eead4, #8b5cf6)', 
                                                    borderRadius: '8px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' 
                                                }}>
                                                    {/* Botones Flotantes de Editar y Eliminar encima de la imagen */}
                                                    <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '5px' }}>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); setEditingId(pl.id); setEditName(pl.name); }}
                                                            style={{ background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', cursor: 'pointer', padding: '6px', borderRadius: '50%', fontSize: '0.9rem' }}
                                                        >✎</button>
                                                        <button 
                                                            onClick={(e) => handleDelete(e, pl.id)}
                                                            style={{ background: 'rgba(0,0,0,0.5)', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: '6px', borderRadius: '50%', fontSize: '0.9rem' }}
                                                        >🗑</button>
                                                    </div>
                                                </div>

                                                {/* Textos de la tarjeta */}
                                                {editingId === pl.id ? (
                                                    <form onSubmit={(e) => handleUpdate(e, pl.id)} onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: '5px' }}>
                                                        <input type="text" value={editName} className="custom-input" onChange={(e) => setEditName(e.target.value)} required autoFocus style={{ flex: 1, padding: '5px', fontSize: '0.9rem', marginBottom: 0 }} />
                                                        <button type="submit" className="submit-btn" style={{ padding: '5px 10px', margin: 0 }}>✔</button>
                                                    </form>
                                                ) : (
                                                    <div>
                                                        <h3 style={{ margin: '0', color: 'white', fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pl.name}</h3>
                                                        <p style={{ margin: '5px 0', color: '#9ca3af', fontSize: '0.85rem' }}>Por {user?.username || 'Ti'}</p>
                                                        <p style={{ margin: '0', color: '#5eead4', fontSize: '0.85rem' }}>0 Canciones</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                        </div>
                    </div>
                </main>
            </div>

            <PlayerBar track={{ title: 'De Música Ligera', artist: 'Soda Stereo' }} />
            
            <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={handleLogoutConfirm} />

            {}
            {isCreating && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(5px)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 9999, animation: 'fadeIn 0.2s ease'
                }}>
                    <div className="info-panel" style={{ width: '100%', maxWidth: '400px', border: '1px solid rgba(94, 234, 212, 0.3)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, color: 'white', fontSize: '1.5rem' }}>Crear Cápsula</h2>
                            <button onClick={() => setIsCreating(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '1.5rem', cursor: 'pointer' }}>✖</button>
                        </div>
                        {errorMsg && <div style={{ color: '#ff6b6b', marginBottom: '15px', fontSize: '0.9rem' }}>{errorMsg}</div>}
                        <form onSubmit={handleCreate}>
                            <div className="input-group">
                                <label style={{ color: '#9ca3af', marginBottom: '8px', display: 'block' }}>Nombre de la cápsula</label>
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
            
        </div>
    );
};

export default Playlists;