import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAlbumDetail } from '../hooks/useAlbumDetail';
import { usePlayer } from '../context/PlayerContext';
import Sidebar from '../components/Sidebar';
import BackButton from '../components/BackButton';
import DetailPlaybackActions from '../components/DetailPlaybackActions';
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
    const { play, currentTrack, isPlaying } = usePlayer();

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

    // ¿Lo que suena ahora pertenece a este álbum?
    const isAlbumPlaying = isPlaying && !!currentTrack &&
        songs.some((song) => song.deezer_id === currentTrack.deezer_id);

    const handlePlayAlbum = () => {
        if (songs.length === 0) return;
        play(songs[0], songs);
    };

    const handleShuffleAlbum = () => {
        if (songs.length === 0) return;
        const randomSong = songs[Math.floor(Math.random() * songs.length)];
        play(randomSong, songs, { shuffle: true });
    };

    return (
        <div className="saas-container">
            <div className="app-background"></div>
            <div className="glass-overlay"></div>

            <div className="saas-workspace">
                <Sidebar user={user} />

                <main className="saas-main-panel">
                    <div className="saas-content-scroll detail-scroll">
                        <div className="content-wrapper detail-content-wrapper">
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
                                    <DetailPlaybackActions
                                        isPlaying={isAlbumPlaying}
                                        shuffleActive={false}
                                        onPlayToggle={handlePlayAlbum}
                                        onShuffle={handleShuffleAlbum}
                                        className="detail-page-actions"
                                        playLabel="Reproducir álbum"
                                        pauseLabel="Pausar álbum"
                                    />
                                    <div className="section-header">
                                        <h2 className="saas-subtitle" style={{ margin: 0 }}>Canciones</h2>
                                    </div>
                                    <div className="tracks-list">
                                        {songs.map((song, index) => {
                                            const isThisPlaying = isPlaying && currentTrack?.deezer_id === song.deezer_id;
                                            return (
                                                <div
                                                    className="track-item"
                                                    key={song.deezer_id}
                                                    onClick={() => play(song, songs)}
                                                >
                                                    <span className="track-number" style={{ color: isThisPlaying ? '#5eead4' : undefined }}>
                                                        {song.track_number || index + 1}
                                                    </span>
                                                    <div className="track-details">
                                                        <h4 style={{ color: isThisPlaying ? '#5eead4' : undefined }}>{song.title}</h4>
                                                    </div>
                                                    <span className="track-time">{formatDuration(song.duration_ms)}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            )}

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AlbumDetail;