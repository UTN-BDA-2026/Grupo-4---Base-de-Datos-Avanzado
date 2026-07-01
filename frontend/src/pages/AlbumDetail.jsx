import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAlbumDetail } from '../hooks/useAlbumDetail';
import { usePlayer } from '../context/PlayerContext';
import { useLibraryActions } from '../hooks/useLibraryActions'; // Importado
import Sidebar from '../components/Sidebar';
import BackButton from '../components/BackButton';
import DetailPlaybackActions from '../components/DetailPlaybackActions';
import AddToPlaylistModal from '../components/AddToPlaylistModal'; // Importado
import Toast from '../components/Toast'; // Importado
import { formatDuration } from '../utils/formatDuration';
import { ACCENT_COLOR } from '../constants/theme';
import '../index.css';

const formatReleaseYear = (dateStr) => {
    if (!dateStr) return '';
    return dateStr.slice(0, 4);
};

const AlbumDetail = () => {
    const { deezerId } = useParams();
    const { user } = useAuth();
    const { album, songs, loading, error } = useAlbumDetail(deezerId);
    const { play, currentTrack, isPlaying } = usePlayer();
    
    // Hooks de biblioteca
    const {
        playlists,
        modal,
        loading: libraryLoading,
        toast,
        openModal,
        closeModal,
        addSongToPlaylist,
    } = useLibraryActions();

    const handleAddClick = (e, song) => {
        e.stopPropagation();
        openModal({ id: song.id, title: song.title });
    };

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
            
            <Toast toast={toast} />

            {modal.open && (
                <AddToPlaylistModal
                    playlists={playlists}
                    item={modal.item}
                    loading={libraryLoading}
                    onSelect={addSongToPlaylist}
                    onClose={closeModal}
                />
            )}

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
                                                    role="button"
                                                    tabIndex={0}
                                                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                                >
                                                    <span className="track-number" style={{ color: isThisPlaying ? ACCENT_COLOR : undefined, minWidth: '40px' }}>
                                                        {(song.track_number || index + 1)}
                                                    </span>

                                                    <div className="track-details" style={{ flex: 1 }}>
                                                        <h4 style={{ color: isThisPlaying ? ACCENT_COLOR : undefined, margin: 0 }}>
                                                            {song.title}
                                                        </h4>
                                                    </div>

                                                    <span className="track-time">{formatDuration(song.duration_ms)}</span>

                                                    <button
                                                        onClick={(e) => handleAddClick(e, song)}
                                                        style={{
                                                            background: 'transparent', 
                                                            color: '#9ca3af', 
                                                            border: 'none',
                                                            fontSize: '1.4rem', 
                                                            cursor: 'pointer', 
                                                            padding: '0 20px', 
                                                            transition: 'color 0.2s',
                                                            display: 'flex',
                                                            alignItems: 'center'
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                                                        onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                                                    >
                                                        ⊕
                                                    </button>
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