import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLibraryActions } from '../hooks/useLibraryActions';
import Sidebar from '../components/Sidebar';
import PlayerBar from '../components/PlayerBar';
import LogoutModal from '../components/LogoutModal';
import Toast from '../components/Toast';
import { createPlaylist } from '../services/playlistService';
import api from '../services/api'; 
import '../index.css';

const Library = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    
    const {
        playlists,
        savedAlbums,
        followedArtists,
        loading,
        toast,
        fetchPlaylists,
        fetchSavedAlbums,
        fetchFollowedArtists,
        handleToggleFollowArtist
    } = useLibraryActions();

    const [activeTab, setActiveTab] = useState('playlists'); 
    
    const [errorMsg, setErrorMsg] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [name, setName] = useState('');
    const [playlistToDelete, setPlaylistToDelete] = useState(null);
    const [localToast, setLocalToast] = useState('');

    useEffect(() => {
        fetchPlaylists();
        fetchSavedAlbums();
        fetchFollowedArtists();
    }, [fetchPlaylists, fetchSavedAlbums, fetchFollowedArtists]);

    useEffect(() => {
        if (activeTab === 'albums') fetchSavedAlbums();
        if (activeTab === 'playlists') fetchPlaylists();
        if (activeTab === 'artists') fetchFollowedArtists();

    }, [activeTab, fetchSavedAlbums, fetchPlaylists, fetchFollowedArtists]);

    const showLocalToast = (msg) => {
        setLocalToast(msg);
        setTimeout(() => setLocalToast(''), 3000);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        try {
            await createPlaylist({ name: name });
            setName('');
            setIsCreating(false);
            fetchPlaylists(); 
            showLocalToast('Playlist creada con éxito.');
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
            showLocalToast('Playlist eliminada correctamente.');
        } catch (error) {
            setPlaylistToDelete(null);
            showLocalToast('Error al eliminar la playlist.');
        }
    };

    const handleLogoutConfirm = async () => {
        await logout();
        navigate('/login');
    };

    const activeToastMessage = toast?.message || localToast;

    return (
        <div className="saas-container">
            <div className="app-background"></div>
            <div className="glass-overlay"></div>

            {activeToastMessage && (
                    <Toast toast={{ message: activeToastMessage, type: toast?.type }} />
            )}

            <div className="saas-workspace">
                <Sidebar user={user} onLogoutClick={() => setShowLogoutModal(true)} />

                <main className="saas-main-panel">
                    <div className="saas-content-scroll">
                        <div className="content-wrapper" style={{ textAlign: 'left', padding: '2rem 3rem', maxWidth: '1200px', margin: '0' }}>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div>
                                    <h1 className="saas-title" style={{ margin: 0, fontSize: '2.5rem', letterSpacing: '-1px' }}>Mi Biblioteca</h1>
                                    <span style={{ color: '#9ca3af', fontSize: '1rem', marginTop: '5px', display: 'block' }}>✧ Tus Playlists</span>
                                </div>
                                
                                {activeTab === 'playlists' && (
                                    <button 
                                        className="submit-btn" 
                                        style={{ width: 'auto', padding: '0.8rem 1.5rem', margin: 0, borderRadius: '50px', fontSize: '0.9rem' }}
                                        onClick={() => { setIsCreating(true); }}
                                    >
                                        Nueva playlist +
                                    </button>
                                )}
                            </div>

                            <div className="profile-tabs" style={{ marginBottom: '2.5rem' }}>
                                <button
                                    className={`profile-tab ${activeTab === 'playlists' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('playlists')}
                                >
                                    Playlists
                                </button>
                                <button
                                    className={`profile-tab ${activeTab === 'albums' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('albums')}
                                >
                                    Álbumes
                                </button>
                                <button
                                    className={`profile-tab ${activeTab === 'artists' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('artists')}
                                >
                                    Artistas
                                </button>
                            </div>

                            <section className="feed-section" style={{ width: '100%' }}>
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
                                    gap: '20px',
                                    width: '100%'
                                }}>
                                    
                                    {activeTab === 'playlists' && (
                                        <>
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
                                                .map((pl) => {
                                                    const playlistCover = pl.cover_url || pl.image;
                                                    return (
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
                                                                width: '100%', aspectRatio: '1/1', 
                                                                background: playlistCover ? `url(${playlistCover}) center/cover` : 'linear-gradient(135deg, #5eead4, #8b5cf6)', 
                                                                borderRadius: '8px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' 
                                                            }}>
                                                                <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '5px' }}>
                                                                    <button 
                                                                        onClick={(e) => confirmDelete(e, pl.id)}
                                                                        style={{ background: 'rgba(0,0,0,0.5)', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: '6px', borderRadius: '50%', fontSize: '0.9rem' }}
                                                                    >
                                                                        🗑
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div style={{ minWidth: 0 }}>
                                                                <h3 style={{ margin: '0', color: 'white', fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pl.name}</h3>
                                                                <p style={{ margin: '5px 0', color: '#9ca3af', fontSize: '0.85rem' }}>Por {pl.owner || 'Ti'}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </>
                                    )}

                                    {activeTab === 'albums' && (
                                        savedAlbums.length === 0 ? (
                                            <div style={{ gridColumn: '1 / -1', color: '#9ca3af', textAlign: 'center', padding: '4rem 0', fontSize: '1rem' }}>
                                                No tienes álbumes guardados en tu biblioteca todavía. 🎧
                                            </div>
                                        ) : (
                                            savedAlbums.map((item) => {
                                                const album = item.album ? item.album : item;
                                                return (
                                                    <div 
                                                        key={album.deezer_id || album.id} 
                                                        onClick={() => navigate(`/album/${album.deezer_id}`)}
                                                        style={{ 
                                                            backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px', padding: '20px',
                                                            cursor: 'pointer', position: 'relative', transition: 'all 0.3s ease', border: '1px solid rgba(255, 255, 255, 0.05)',
                                                            width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '12px'
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.07)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'}
                                                    >
                                                        <div style={{ 
                                                            width: '100%', aspectRatio: '1/1', 
                                                            background: album.cover_url ? `url(${album.cover_url}) center/cover` : 'linear-gradient(135deg, #8b5cf6, #5eead4)', 
                                                            borderRadius: '8px'
                                                        }} />
                                                        <div style={{ minWidth: 0, textAlign: 'left' }}>
                                                            <h3 style={{ margin: '0', color: 'white', fontSize: '1.05rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{album.name}</h3>
                                                            <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{album.artist?.name || 'Artista'}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )
                                    )}

                                    {activeTab === 'artists' && (
                                        followedArtists.length === 0 ? (
                                            <div style={{ gridColumn: '1 / -1', color: '#9ca3af', textAlign: 'center', padding: '4rem 0', fontSize: '1rem' }}>
                                                Todavía no seguís a ningún artista. 🎤
                                            </div>
                                        ) : (
                                            followedArtists.map((item) => {
                                                const artist = item.artist;
                                                return (
                                                    <div
                                                        key={artist.deezer_id}
                                                        onClick={() => navigate(`/artist/${artist.deezer_id}`)}
                                                        style={{
                                                            backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px', padding: '20px',
                                                            cursor: 'pointer', position: 'relative', transition: 'all 0.3s ease', border: '1px solid rgba(255, 255, 255, 0.05)',
                                                            width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px'
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.07)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'}
                                                    >
                                                        <div style={{
                                                            width: '100%', aspectRatio: '1/1', borderRadius: '50%',
                                                            background: artist.image_url ? `url(${artist.image_url}) center/cover` : 'linear-gradient(135deg, #5eead4, #3b82f6)',
                                                        }} />
                                                        <div style={{ minWidth: 0, textAlign: 'center', width: '100%' }}>
                                                            <h3 style={{ margin: '0', color: 'white', fontSize: '1.05rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                {artist.name}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )
                                    )}
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
                    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
                }}>
                    <div className="info-panel" style={{ width: '100%', maxWidth: '400px', border: '1px solid rgba(94, 234, 212, 0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, color: 'white', fontSize: '1.5rem' }}>Crear Playlist</h2>
                            <button onClick={() => setIsCreating(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '1.5rem', cursor: 'pointer' }}>✖</button>
                        </div>
                        {errorMsg && <div style={{ color: '#ff6b6b', marginBottom: '15px', fontSize: '0.9rem' }}>{errorMsg}</div>}
                        <form onSubmit={handleCreate}>
                            <input type="text" value={name} className="custom-input" onChange={(e) => setName(e.target.value)} required autoFocus placeholder="Ej: Frecuencias de Estudio" style={{ width: '100%', boxSizing: 'border-box' }} />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
                                <button type="button" onClick={() => setIsCreating(false)} style={{ padding: '10px 20px', background: 'transparent', color: '#9ca3af', border: 'none', cursor: 'pointer' }}>Cancelar</button>
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
                    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
                }}>
                    <div className="info-panel" style={{ width: '100%', maxWidth: '400px', backgroundColor: '#111', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '25px', textAlign: 'center' }}>
                        <h2 style={{ margin: '0 0 1rem 0', color: 'white', fontSize: '1.3rem' }}>¿Eliminar playlist?</h2>
                        <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>Esta acción no se puede deshacer.</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                            <button onClick={() => setPlaylistToDelete(null)} style={{ padding: '10px 20px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'transparent', color: 'white', cursor: 'pointer' }}>Cancelar</button>
                            <button onClick={executeDelete} style={{ padding: '10px 20px', border: 'none', backgroundColor: '#ff6b6b', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
};

export default Library;