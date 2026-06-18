import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import PlayerBar from '../components/PlayerBar';
import api from '../services/api';
import '../index.css';

const PlaylistDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [playlist, setPlaylist] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const { data } = await api.get(`/playlists/${id}/`);
                setPlaylist(data);
            } catch (error) {
                console.error("Error al cargar la playlist", error);
            }
        };
        fetchDetail();
    }, [id]);

    if (!playlist) return <div className="saas-container"><div className="app-background"></div></div>;

    return (
        <div className="saas-container">
            <div className="app-background"></div>
            <div className="glass-overlay"></div>

            <div className="saas-workspace">
                <Sidebar user={user} />

                <main className="saas-main-panel">
                    <div className="saas-content-scroll" style={{ padding: '2rem 4rem' }}>
                        
                        {/* CABECERA GIGANTE ESTILO SPOTIFY */}
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-end', marginBottom: '2rem', marginTop: '2rem' }}>
                            <div style={{ width: '230px', height: '230px', background: 'linear-gradient(135deg, #5eead4, #8b5cf6)', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}></div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <span style={{ color: '#5eead4', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px' }}>CÁPSULA</span>
                                <h1 style={{ color: 'white', fontSize: '4.5rem', margin: 0, fontWeight: '900', lineHeight: '1.1', letterSpacing: '-1px' }}>
                                    {playlist.name}
                                </h1>
                                <p style={{ color: '#9ca3af', fontSize: '1rem', marginTop: '10px' }}>Los mejores tracks para tus viajes nocturnos.</p>
                                <div style={{ color: 'white', fontSize: '0.9rem', marginTop: '5px' }}>
                                    <strong>{user?.username || 'Usuario'}</strong> <span style={{color: '#9ca3af'}}>• 1 canciones</span>
                                </div>
                            </div>
                        </div>

                        {/* BOTONES DE PLAY, EDITAR Y ELIMINAR */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '2.5rem' }}>
                            <button style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#5eead4', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', boxShadow: '0 8px 20px rgba(94, 234, 212, 0.3)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="black"><path d="M6 4l15 8-15 8V4z"/></svg>
                            </button>
                            
                            <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                ✎ Editar
                            </button>
                            
                            <button style={{ background: 'transparent', border: '1px solid rgba(255,107,107,0.3)', color: '#ff6b6b', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                🗑 Eliminar Playlist
                            </button>
                        </div>

                        {/* TABLA DE CANCIONES */}
                        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#9ca3af', textAlign: 'left', fontSize: '0.95rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ padding: '10px 15px', width: '40px', fontWeight: '500' }}>#</th>
                                    <th style={{ padding: '10px 15px', fontWeight: '500' }}>CANCIÓNES</th>
                                    <th style={{ padding: '10px 15px', fontWeight: '500' }}>ÁLBUM</th>
                                    <th style={{ padding: '10px 15px', textAlign: 'right', fontWeight: '500' }}>⏱</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Fila de ejemplo estática */}
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    <td style={{ padding: '15px' }}>1</td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ color: 'white', fontWeight: '500' }}>Nightcall</div>
                                        <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '3px' }}>Kavinsky</div>
                                    </td>
                                    <td style={{ padding: '15px' }}>OutRun</td>
                                    <td style={{ padding: '15px', textAlign: 'right' }}>4:19</td>
                                </tr>
                            </tbody>
                        </table>

                    </div>
                </main>
            </div>

            <PlayerBar track={{ title: playlist.name, artist: 'Reproduciendo...' }} />
        </div>
    );
};

export default PlaylistDetail;