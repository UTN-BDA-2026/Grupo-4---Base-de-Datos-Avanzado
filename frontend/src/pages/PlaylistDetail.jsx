import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePlaylist } from '../hooks/usePlaylist';
import { usePlayer } from '../context/PlayerContext';
import Sidebar from '../components/Sidebar';
import LogoutModal from '../components/LogoutModal';
import BackButton from '../components/BackButton';
import DetailPlaybackActions from '../components/DetailPlaybackActions';
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
    const { play, currentTrack, isPlaying } = usePlayer();

    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [songToDelete, setSongToDelete] = useState(null);
    // Solo visual: indica si el último play disparado fue aleatorio.
    const [shuffleMode, setShuffleMode] = useState(false);

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
        await removeSong(songToDelete);
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

    const playlistCover = playlist.image || playlist.cover_url;
    const firstPlaylistSong = playlist.songs?.[0]?.song;

    // ¿Lo que suena ahora pertenece a esta playlist?
    const isPlaylistPlaying = isPlaying && !!currentTrack &&
        playlist.songs?.some((ps) => ps.song.deezer_id === currentTrack.deezer_id);

    const handlePlayPlaylist = () => {
        if (!firstPlaylistSong) return;
        const songs = (playlist.songs || []).filter((item) => item.song).map((item) => item.song);
        play(firstPlaylistSong, songs);
    };

    const handleShufflePlaylist = () => {
        const songs = (playlist.songs || []).filter((item) => item.song).map((item) => item.song);
        if (songs.length === 0) return;
        const randomSong = songs[Math.floor(Math.random() * songs.length)];
        play(randomSong, songs, { shuffle: true });
    };

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
                    <div className="saas-content-scroll detail-scroll">
                        <div className="content-wrapper detail-content-wrapper">
                            <BackButton />

                            {/* CABECERA */}
                            <div className="profile-hero detail-hero playlist-detail-hero">
                                <div className="playlist-detail-cover" style={{
                                    background: playlistCover ? `url(${playlistCover}) center/cover` : 'linear-gradient(135deg, #5eead4, #8b5cf6)'
                                }} />

                                <div className="playlist-detail-info">
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
                                        <h1 className="playlist-detail-title">
                                            {playlist.name}
                                        </h1>
                                    )}

                                    {playlist.description && (
                                        <p style={{ color: '#9ca3af', fontSize: '1rem', marginTop: '4px' }}>{playlist.description}</p>
                                    )}
                                    <div className="playlist-detail-meta">
                                        <strong>{playlist.owner || user?.username}</strong>
                                        <span style={{ color: '#9ca3af' }}> • {playlist.total_songs || playlist.songs?.length || 0} canciones • {playlist.total_duration || '0:00'}</span>
                                    </div>
                                </div>
                            </div>

                            <DetailPlaybackActions
                                isPlaying={isPlaylistPlaying}
                                shuffleActive={shuffleMode}
                                onPlayToggle={handlePlayPlaylist}
                                onShuffle={handleShufflePlaylist}
                                className="detail-page-actions playlist-page-actions"
                                playLabel="Reproducir playlist"
                                pauseLabel="Pausar playlist"
                                playDisabled={!playlist.songs || playlist.songs.length === 0}
                                shuffleDisabled={!playlist.songs || playlist.songs.length === 0}
                            >
                                <button className="detail-pill-btn" type="button" onClick={() => { setIsEditing(true); setEditName(playlist.name); }}>
                                    Editar
                                </button>
                                <button className="detail-pill-btn danger" type="button" onClick={() => setShowDeleteModal(true)}>
                                    Eliminar
                                </button>
                            </DetailPlaybackActions>

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
                                        const songCover = ps.song.album?.image || ps.song.album?.cover_url;
                                        const isThisPlaying = isPlaying && currentTrack?.deezer_id === ps.song.deezer_id;

                                        return (
                                            <tr
                                                key={ps.id}
                                                onClick={() => {
                                                    const songs = (playlist.songs || []).filter((item) => item.song).map((item) => item.song);
                                                    play(ps.song, songs);
                                                }}
                                                style={{
                                                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                                                    transition: 'background 0.2s',
                                                    cursor: 'pointer',
                                                    backgroundColor: isThisPlaying ? 'rgba(94,234,212,0.08)' : 'transparent'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isThisPlaying ? 'rgba(94,234,212,0.08)' : 'rgba(255,255,255,0.05)'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isThisPlaying ? 'rgba(94,234,212,0.08)' : 'transparent'}
                                            >
                                                <td style={{ padding: '15px', color: isThisPlaying ? '#5eead4' : '#9ca3af' }}>{index + 1}</td>
                                                <td style={{ padding: '15px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <div style={{
                                                            width: '40px', height: '40px', borderRadius: '6px', flexShrink: 0,
                                                            background: songCover
                                                                ? `url(${songCover}) center/cover`
                                                                : 'rgba(255,255,255,0.08)'
                                                        }} />
                                                        <div>
                                                            <div style={{ color: isThisPlaying ? '#5eead4' : 'white', fontWeight: '500' }}>{ps.song.title}</div>
                                                            <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '3px' }}>{ps.song.artist?.name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '15px' }}>{ps.song.album?.name || 'Sencillo'}</td>
                                                <td style={{ padding: '15px', textAlign: 'right' }}>{formatDuration(ps.song.duration_ms)}</td>
                                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setSongToDelete(ps.song.id); }}
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
                    </div>
                </main>
            </div>

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