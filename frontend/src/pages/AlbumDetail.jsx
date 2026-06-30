import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAlbumDetail } from '../hooks/useAlbumDetail';
import Sidebar from '../components/Sidebar';
import PlayerBar from '../components/PlayerBar';
import BackButton from '../components/BackButton';
import '../index.css';

const formatDuration = (ms) => {
    if (!ms) return '0:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const formatReleaseYear = (dateStr) => {
    if (!dateStr) return '';
    return dateStr.slice(0, 4);
};

const AlbumDetail = () => {
    const { deezerId } = useParams();
    const { user } = useAuth();
    const { album, songs, loading, error } = useAlbumDetail(deezerId);
    const [playerTrack, setPlayerTrack] = useState(null);
    const [shufflePlayback, setShufflePlayback] = useState(false);
    const [playSignal, setPlaySignal] = useState(0);

    if (loading) {
        return (
            <div className="saas-container">
                <div className="app-background"></div>
                <div className="glass-overlay"></div>
                <div className="saas-workspace">
                    <Sidebar user={user} />
                    <main className="saas-main-panel">
                        <div className="saas-content-scroll">
                            <p>Cargando álbum...</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    if (error || !album) {
        return (
            <div className="saas-container">
                <div className="app-background"></div>
                <div className="glass-overlay"></div>
                <div className="saas-workspace">
                    <Sidebar user={user} />
                    <main className="saas-main-panel">
                        <div className="saas-content-scroll">
                            <p>No se pudo cargar el álbum.</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    const defaultTrack = songs[0]
        ? { title: songs[0].title, artist: songs[0].artist?.name }
        : { title: 'Sin reproducción', artist: '—' };

    const currentTrack = playerTrack || defaultTrack;

    const handlePlayAlbum = () => {
        setPlayerTrack(defaultTrack);
        setShufflePlayback(false);
        setPlaySignal((signal) => signal + 1);
    };

    const handleShuffleAlbum = () => {
        if (songs.length === 0) return;
        const randomSong = songs[Math.floor(Math.random() * songs.length)];
        setPlayerTrack({ title: randomSong.title, artist: randomSong.artist?.name || album.artist?.name });
        setShufflePlayback(true);
        setPlaySignal((signal) => signal + 1);
    };

    return (
        <div className="saas-container">
            <div className="app-background"></div>
            <div className="glass-overlay"></div>

            <div className="saas-workspace">
                <Sidebar user={user} />

                <main className="saas-main-panel">
                    <div className="saas-content-scroll">
                        <div className="content-wrapper">
                            <BackButton />

                            <div className="profile-hero detail-hero compact-detail-hero">
                                <div className="profile-hero-left">
                                    <div
                                        className="profile-avatar-large"
                                        style={album.cover_url ? {
                                            backgroundImage: `url(${album.cover_url})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        } : undefined}
                                    >
                                        {!album.cover_url && album.name?.charAt(0)}
                                    </div>
                                    <div className="profile-info">
                                        <span className="profile-label">{album.album_type === 'single' ? 'Sencillo' : 'Álbum'}</span>
                                        <h1 className="profile-name">{album.name}</h1>
                                        <div className="profile-badges">
                                            <span className="badge-dark">{album.artist?.name}</span>
                                            {album.release_date && (
                                                <span className="badge-dark">{formatReleaseYear(album.release_date)}</span>
                                            )}
                                            <span className="badge-dark">{album.total_tracks} canciones</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {songs.length > 0 && (
                                <section className="profile-section">
                                    <div className="detail-actions">
                                        <button className="detail-play-btn" type="button" onClick={handlePlayAlbum} aria-label="Reproducir album">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="black" aria-hidden="true"><path d="M6 4l15 8-15 8V4z" /></svg>
                                        </button>
                                        <button className={`detail-icon-btn ${shufflePlayback ? 'active' : ''}`} type="button" onClick={handleShuffleAlbum} aria-label="Reproduccion aleatoria" title="Reproduccion aleatoria">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                <polyline points="16 3 21 3 21 8"></polyline>
                                                <line x1="4" y1="20" x2="21" y2="3"></line>
                                                <polyline points="21 16 21 21 16 21"></polyline>
                                                <line x1="15" y1="15" x2="21" y2="21"></line>
                                                <line x1="4" y1="4" x2="9" y2="9"></line>
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="section-header">
                                        <h2 className="saas-subtitle" style={{ margin: 0 }}>Canciones</h2>
                                    </div>
                                    <div className="tracks-list">
                                        {songs.map((song, index) => (
                                            <div
                                                className="track-item"
                                                key={song.deezer_id}
                                                onClick={() => {/* reproducir */}}
                                            >
                                                <span className="track-number">{song.track_number || index + 1}</span>
                                                <div className="track-details">
                                                    <h4>{song.title}</h4>
                                                </div>
                                                <span className="track-time">{formatDuration(song.duration_ms)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                        </div>
                    </div>
                </main>
            </div>

            <PlayerBar track={currentTrack} shuffleActive={shufflePlayback} playSignal={playSignal} />
        </div>
    );
};

export default AlbumDetail;
