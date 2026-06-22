import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import PlayerBar from '../components/PlayerBar';
import api from '../services/api';
import '../index.css';

const TrackDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [track, setTrack] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        const fetchTrackDetail = async () => {
            try {
                const { data } = await api.get(`/tracks/${id}/`); 
                setTrack(data);
            } catch (error) {
                setTrack({
                    id: id,
                    title: 'Get Lucky',
                    artist_name: 'Daft Punk',
                    album: 'Random Access Memories',
                    duration: '4:08'
                });
            } finally {
                setLoading(false);
            }
        };

        const fetchUserPlaylists = async () => {
            try {
                const { data } = await api.get('/playlists/');
                setUserPlaylists(data);
            } catch (error) {
                console.error("Error al cargar playlists", error);
            }
        };

        fetchTrackDetail();
        fetchUserPlaylists();
    }, [id]);


    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage('');
        }, 3000);
    };

    const handleLike = async () => {
        try {
            setIsLiked(!isLiked);
            showToast(`"${track?.title}" se agregó a tus Me gusta.`);
        } catch (error) {
            console.error("Error al dar me gusta", error);
        }
    };

    const handleAddToPlaylist = async (playlistId, playlistName) => {
        try {
            setShowPlaylistModal(false);
            showToast(`Añadida a la cápsula "${playlistName}"`);
        } catch (error) {
            console.error("Error al añadir a la playlist", error);
        }
    };

    if (loading) return <div className="saas-container" style={{ backgroundColor: '#050505' }}></div>;

    return (
        <div className="saas-container">
            <div className="app-background"></div>
            <div className="glass-overlay"></div>

            {/* ====== MENSAJE FLOTANTE (TOAST) ====== */}
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
                <Sidebar user={user} />

                <main className="saas-main-panel">
                    <div className="saas-content-scroll">
                        <div className="content-wrapper" style={{ textAlign: 'left', padding: '2rem 3rem', maxWidth: '1200px', margin: '0' }}>
                            
                            <button 
                                onClick={() => navigate(-1)} 
                                style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                            >
                                ← Volver
                            </button>

                            <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap' }}>
                                <div style={{ 
                                    width: '230px', height: '230px', 
                                    background: 'linear-gradient(135deg, #3b82f6, #5eead4)', 
                                    borderRadius: '12px', boxShadow: '0 15px 35px rgba(0,0,0,0.5)' 
                                }}></div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <span style={{ color: '#5eead4', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                        Sencillo
                                    </span>
                                    <h1 style={{ color: 'white', fontSize: '4.5rem', margin: 0, fontWeight: '900', lineHeight: '1.1', letterSpacing: '-2px' }}>
                                        {track?.title}
                                    </h1>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#8b5cf6' }}></div>
                                        <span style={{ color: 'white', fontSize: '1.1rem', fontWeight: '500' }}>{track?.artist_name}</span>
                                        <span style={{ color: '#9ca3af' }}>•</span>
                                        <span style={{ color: '#9ca3af', fontSize: '1rem' }}>{track?.album}</span>
                                        <span style={{ color: '#9ca3af' }}>•</span>
                                        <span style={{ color: '#9ca3af', fontSize: '1rem' }}>{track?.duration}</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '3rem' }}>
                                <button style={{ 
                                    width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#5eead4', 
                                    border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', 
                                    cursor: 'pointer', boxShadow: '0 8px 25px rgba(94, 234, 212, 0.4)'
                                }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="black"><path d="M6 4l15 8-15 8V4z"/></svg>
                                </button>
                                
                                <button 
                                    onClick={handleLike}
                                    style={{ 
                                        background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', 
                                        color: isLiked ? '#5eead4' : 'white', 
                                        padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', fontWeight: '500',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {isLiked ? '♥ Me gusta' : '♡ Me gusta'}
                                </button>
                                <button 
                                    onClick={() => setShowPlaylistModal(true)}
                                    style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', fontWeight: '500' }}
                                >
                                    + Añadir a playlist
                                </button>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
            <PlayerBar track={{ title: track?.title || 'Cargando...', artist: track?.artist_name || '' }} />

            {showPlaylistModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(5px)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 9999, animation: 'fadeIn 0.2s ease'
                }}>
                    <div className="info-panel" style={{ 
                        width: '100%', maxWidth: '400px', backgroundColor: '#111', 
                        border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '20px' 
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, color: 'white', fontSize: '1.2rem' }}>Añadir a playlist</h2>
                            <button onClick={() => setShowPlaylistModal(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '1.5rem', cursor: 'pointer' }}>✖</button>
                        </div>
                        
                        <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {userPlaylists.length === 0 ? (
                                <p style={{ color: '#9ca3af', textAlign: 'center' }}>No tienes playlists creadas.</p>
                            ) : (
                                userPlaylists.map(pl => (
                                    <div 
                                        key={pl.id} 
                                        onClick={() => handleAddToPlaylist(pl.id, pl.name)}
                                        style={{ 
                                            display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', 
                                            backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', cursor: 'pointer',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}
                                    >
                                        <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #5eead4, #8b5cf6)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ color: 'black', fontSize: '1.2rem' }}>♪</span>
                                        </div>
                                        <span style={{ color: 'white', fontWeight: '500' }}>{pl.name}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackDetail;