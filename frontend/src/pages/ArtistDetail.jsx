import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useArtistDetail } from '../hooks/useArtistDetail';
import Sidebar from '../components/Sidebar';
import AlbumCard from '../components/AlbumCard';
import PlayerBar from '../components/PlayerBar';
import FollowButton from '../components/FollowedButton';
import BackButton from '../components/BackButton';
import '../index.css';

const formatFollowers = (count) => {
    if (!count) return '0 seguidores';
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M seguidores`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K seguidores`;
    return `${count} seguidores`;
};

const formatDuration = (ms) => {
    if (!ms) return '0:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const ArtistDetail = () => {
    const { deezerId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const {
        artist,
        songs,
        albums,
        albumsLoading,
        albumTab,
        setAlbumTab,
        loading,
        error,
        toggleFollow,
        followLoading,
    } = useArtistDetail(deezerId);

    if (loading) {
        return (
            <div className="saas-container">
                <div className="app-background"></div>
                <div className="glass-overlay"></div>
                <div className="saas-workspace">
                    <Sidebar user={user} />
                    <main className="saas-main-panel">
                        <div className="saas-content-scroll">
                            <p>Cargando artista...</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    if (error || !artist) {
        return (
            <div className="saas-container">
                <div className="app-background"></div>
                <div className="glass-overlay"></div>
                <div className="saas-workspace">
                    <Sidebar user={user} />
                    <main className="saas-main-panel">
                        <div className="saas-content-scroll">
                            <p>No se pudo cargar el artista.</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    const currentTrack = songs[0]
        ? { title: songs[0].title, artist: songs[0].artist?.name }
        : { title: 'Sin reproducción', artist: '—' };

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

                            <div className="profile-hero">
                                <div className="profile-hero-left">
                                    <div
                                        className="profile-avatar-large"
                                        style={artist.image_url ? {
                                            backgroundImage: `url(${artist.image_url})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        } : undefined}
                                    >
                                        {!artist.image_url && artist.name?.charAt(0)}
                                    </div>
                                    <div className="profile-info">
                                        <span className="profile-label">Artista</span>
                                        <h1 className="profile-name">{artist.name}</h1>
                                        <div className="profile-badges" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                            <span className="badge-dark">{formatFollowers(artist.followers)}</span>
                                            <FollowButton
                                                isFollowing={artist.is_following}
                                                onToggle={toggleFollow}
                                                loading={followLoading}
                                                size="md"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {songs.length > 0 && (
                                <section className="profile-section">
                                    <div className="section-header">
                                        <h2 className="saas-subtitle" style={{ margin: 0 }}>Canciones populares</h2>
                                    </div>
                                    <div className="tracks-list">
                                        {songs.slice(0, 10).map((song, index) => (
                                            <div
                                                className="track-item"
                                                key={song.deezer_id}
                                                onClick={() => {/* reproducir */}}
                                            >
                                                <span className="track-number">{index + 1}</span>
                                                <div
                                                    className="track-thumb"
                                                    style={song.album?.cover_url ? {
                                                        backgroundImage: `url(${song.album.cover_url})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                    } : undefined}
                                                ></div>
                                                <div className="track-details">
                                                    <h4>{song.title}</h4>
                                                </div>
                                                <span className="track-time">{formatDuration(song.duration_ms)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            <section className="profile-section">
                                <div className="section-header">
                                    <h2 className="saas-subtitle" style={{ margin: 0 }}>Discografía</h2>
                                </div>

                                <div className="profile-tabs">
                                    <button
                                        className={`profile-tab ${albumTab === 'popular' ? 'active' : ''}`}
                                        onClick={() => setAlbumTab('popular')}
                                    >
                                        Lanzamientos populares
                                    </button>
                                    <button
                                        className={`profile-tab ${albumTab === 'album' ? 'active' : ''}`}
                                        onClick={() => setAlbumTab('album')}
                                    >
                                        Álbumes
                                    </button>
                                    <button
                                        className={`profile-tab ${albumTab === 'singles' ? 'active' : ''}`}
                                        onClick={() => setAlbumTab('singles')}
                                    >
                                        Sencillos y EPs
                                    </button>
                                </div>

                                {albumsLoading && <p>Cargando...</p>}

                                {albumsLoading && <p>Cargando lanzamientos...</p>}
                                {!albumsLoading && albums.length === 0 && (
                                    <p style={{ color: 'rgba(255,255,255,0.5)' }}>No hay lanzamientos en esta categoría.</p>
                                )}

                                {!albumsLoading && albums.length > 0 && (
                                    <div className="compact-grid">
                                        {albums.map((album) => (
                                            <AlbumCard
                                                key={album.deezer_id}
                                                title={album.name}
                                                artist={artist.name}
                                                cover={album.cover_url}
                                                albumType={album.album_type}
                                                onClick={() => navigate(`/album/${album.deezer_id}`)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </section>

                        </div>
                    </div>
                </main>
            </div>

            <PlayerBar track={currentTrack} />
        </div>
    );
};

export default ArtistDetail;
