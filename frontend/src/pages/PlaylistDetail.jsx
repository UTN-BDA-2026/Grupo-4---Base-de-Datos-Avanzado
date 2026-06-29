import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePlaylist } from '../hooks/usePlaylist';
import Sidebar from '../components/Sidebar';
import PlayerBar from '../components/PlayerBar';
import LogoutModal from '../components/LogoutModal';
import '../index.css';

const formatDuration = (ms) => {
    if (!ms) return '—';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const PlaylistDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { playlist, loading, error, toast, updatePlaylist, deletePlaylist, removeSong } = usePlaylist(id);

    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [songToDelete, setSongToDelete] = useState(null);

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const ok = await updatePlaylist(editName);
        if (ok) setIsEditing(false);
    };

    const handleDeletePlaylist = async () => {
        const ok = await deletePlaylist();
        if (ok) navigate('/playlists');
    };

    const handleRemoveSong = async () => {
        if (!songToDelete) return;
        await removeSong(songToDelete); // Pasa el ID de la canción pura al servicio
        setSongToDelete(null);
    };

    if (loading) return (
        <div className="saas-container">
            <div className="app-background"></div>
            <p style={{ color: '#9ca3af', padding: '4rem' }}>Cargando playlist...</p>
        </div>
    );

    if (error || !playlist) return (
        <div className="saas-container">
            <div className="app-background"></div>
            <p style={{ color: '#f87171', padding: '4rem' }}>{error || 'Playlist no encontrada.'}</p>
        </div>
    );

    // Priorizamos la propiedad de imagen que envíe tu backend (image o cover_url)
    const playlistCover = playlist.image || playlist.cover_url;

    return (
        <div className="saas-container">
            <div className="app-background"></div>
            <div className="glass-overlay"></div>

            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', top: '30px', left: '50%', transform: 'translateX(-50%)',
                    backgroundColor: toast.type === 'error' ? '#dc2626' : '#5eead4',
                    color: toast.type === 'error' ? 'white' : 'black',
                    padding: '12px 24px', borderRadius: '50px', fontWeight: '600',
                    fontSize: '0.95rem', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', zIndex: 10000
                }}>
                    {toast.type === 'error' ? '✕' : '✓'} {toast.message}
                </div>
            )}

            <div className="saas-workspace">
                <Sidebar user={user} onLogoutClick={() => setShowLogoutModal(true)} />

                <main className="saas-main-panel">
                    <div className="saas-content-scroll" style={{ padding: '2rem 4rem' }}>

                        {/* CABECERA */}
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-end', marginBottom: '2rem', marginTop: '2rem' }}>
                            <div style={{
                                width: '230px', height: '230px', borderRadius: '12px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.5)', flexShrink: 0,
                                background: playlistCover
                                    ? `url(${playlistCover}) center/cover`
                                    : 'linear-gradient(135deg, #5eead4, #8b5cf6)'
                            }} />

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <span style={{ color: '#5eead4', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                                    {playlist.is_public ? 'PLAYLIST PÚBLICA' : 'PLAYLIST PRIVADA'}
                                </span>

                                {isEditing ? (
                                    <form onSubmit={handleEditSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="custom-input"
                                            autoFocus
                                            required
                                            style={{ fontSize: '2rem', padding: '8px 16px', borderRadius: '8px' }}
                                        />
                                        <button type="submit" className="submit-btn" style={{ margin: 0, width: 'auto', padding: '8px 20px' }}>✔</button>
                                        <button type="button" onClick={() => setIsEditing(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
                                    </form>
                                ) : (
                                    <h1 style={{ color: 'white', fontSize: '4.5rem', margin: 0, fontWeight: '900', lineHeight: '1.1', letterSpacing: '-1px' }}>
                                        {playlist.name}
                                    </h1>
                                )}

                                {playlist.description && (
                                    <p style={{ color: '#9ca3af', fontSize: '1rem', marginTop: '4px' }}>{playlist.description}</p>
                                )}
                                <div style={{ color: 'white', fontSize: '0.9rem', marginTop: '5px' }}>
                                    <strong>{playlist.owner || user?.username}</strong>
                                    <span style={{ color: '#9ca3af' }}> • {playlist.total_songs || playlist.songs?.length || 0} canciones • {playlist.total_duration || '0:00'}</span>
                                </div>
                            </div>
                        </div>

                        {/* BOTONES */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '2.5rem' }}>
                            <button style={{
                                width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#5eead4',
                                border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center',
                                cursor: 'pointer', boxShadow: '0 8px 20px rgba(94, 234, 212, 0.3)'
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="black"><path d="M6 4l15 8-15 8V4z" /></svg>
                            </button>

                            <button
                                onClick={() => { setIsEditing(true); setEditName(playlist.name); }}
                                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}
                            >
                                ✎ Editar
                            </button>

                            <button
                                onClick={() => setShowDeleteModal(true)}
                                style={{ background: 'transparent', border: '1px solid rgba(255,107,107,0.3)', color: '#ff6b6b', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}
                            >
                                🗑 Eliminar Playlist
                            </button>
                        </div>

                        {/* TABLA DE CANCIONES */}
                        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#9ca3af', textAlign: 'left', fontSize: '0.95rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ padding: '10px 15px', width: '40px', fontWeight: '500' }}>#</th>
                                    <th style={{ padding: '10px 15px', fontWeight: '500' }}>CANCIONES</th>
                                    <th style={{ padding: '10px 15px', fontWeight: '500' }}>ÁLBUM</th>
                                    <th style={{ padding: '10px 15px', textAlign: 'right', fontWeight: '500' }}>⏱</th>
                                    <th style={{ padding: '10px 15px', width: '40px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {(!playlist.songs || playlist.songs.length === 0) && (
                                    <tr>
                                        <td colSpan={5} style={{ padding: '40px 15px', textAlign: 'center', color: '#9ca3af' }}>
                                            Esta playlist está vacía. ¡Agregá canciones desde la búsqueda!
                                        </td>
                                    </tr>
                                )}
                                {playlist.songs?.map((ps, index) => {
                                    // Soportamos que la imagen del álbum venga tanto en cover_url como en image
                                    const songCover = ps.song.album?.image || ps.song.album?.cover_url;
                                    
                                    return (
                                        <tr
                                            key={ps.id}
                                            style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <td style={{ padding: '15px', color: '#9ca3af' }}>{index + 1}</td>
                                            <td style={{ padding: '15px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{
                                                        width: '40px', height: '40px', borderRadius: '6px', flexShrink: 0,
                                                        background: songCover
                                                            ? `url(${songCover}) center/cover`
                                                            : 'rgba(255,255,255,0.08)'
                                                    }} />
                                                    <div>
                                                        <div style={{ color: 'white', fontWeight: '500' }}>{ps.song.title}</div>
                                                        <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '3px' }}>{ps.song.artist?.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '15px' }}>{ps.song.album?.name || 'Sencillo'}</td>
                                            <td style={{ padding: '15px', textAlign: 'right' }}>{formatDuration(ps.song.duration_ms)}</td>
                                            <td style={{ padding: '15px', textAlign: 'center' }}>
                                                <button
                                                    onClick={() => setSongToDelete(ps.song.id)}
                                                    style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '1rem', transition: 'color 0.2s' }}
                                                    onMouseEnter={(e) => e.currentTarget.style.color = '#ff6b6b'}
                                                    onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                                                    title="Quitar de la playlist"
                                                >
                                                    🗑
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            <PlayerBar track={{ title: playlist.name, artist: playlist.owner || '—' }} />
            <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={async () => { navigate('/login'); }} />

            {/* Modal eliminar playlist */}
            {showDeleteModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
                    <div style={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '25px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                        <h2 style={{ margin: '0 0 1rem 0', color: 'white' }}>¿Eliminar playlist?</h2>
                        <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>Esta acción no se puede deshacer.</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                            <button onClick={() => setShowDeleteModal(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'transparent', color: 'white', cursor: 'pointer' }}>Cancelar</button>
                            <button onClick={handleDeletePlaylist} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#ff6b6b', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Eliminar</button>
                        </div>
                    </div>
                </div>
            )}

            {songToDelete && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
                    <div style={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '25px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                        <h2 style={{ margin: '0 0 1rem 0', color: 'white' }}>¿Quitar canción?</h2>
                        <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>Se quitará de esta playlist pero seguirá en tu biblioteca.</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                            <button onClick={() => setSongToDelete(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'transparent', color: 'white', cursor: 'pointer' }}>Cancelar</button>
                            <button onClick={handleRemoveSong} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#ff6b6b', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Quitar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlaylistDetail;