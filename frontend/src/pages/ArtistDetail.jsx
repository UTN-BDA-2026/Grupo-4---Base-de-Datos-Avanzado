import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useArtistDetail } from '../hooks/useArtistDetail';
import { usePlayer } from '../context/PlayerContext';
import { useLibraryActions } from '../hooks/useLibraryActions';
import Sidebar from '../components/Sidebar';
import AlbumCard from '../components/AlbumCard';
import TrackRow from '../components/TrackRow';
import FollowButton from '../components/FollowedButton';
import BackButton from '../components/BackButton';
import DetailPlaybackActions from '../components/DetailPlaybackActions';
import AddToPlaylistModal from '../components/AddToPlaylistModal';
import Toast from '../components/Toast';
import { formatDuration } from '../utils/formatDuration';
import '../index.css';

const formatFollowers = (count) => {
    if (!count) return '0 seguidores';
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M seguidores`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K seguidores`;
    return `${count} seguidores`;
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

    const { play, currentTrack, isPlaying } = usePlayer();

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

    const popularSongs = songs.slice(0, 10);

    const isArtistPlaying = isPlaying && !!currentTrack &&
        popularSongs.some((song) => song.deezer_id === currentTrack.deezer_id);

    const handlePlayArtist = () => {
        if (popularSongs.length === 0) return;
        play(popularSongs[0], popularSongs);
    };

    const handleShuffleArtist = () => {
        if (popularSongs.length === 0) return;
        const randomSong = popularSongs[Math.floor(Math.random() * popularSongs.length)];
        play(randomSong, popularSongs, { shuffle: true });
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

                            <div className="profile-hero detail-hero artist-detail-hero">
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
                                        <div className="profile-badges artist-meta-row">
                                            <span className="badge-dark">{formatFollowers(artist.followers)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <DetailPlaybackActions
                                isPlaying={isArtistPlaying}
                                shuffleActive={false}
                                onPlayToggle={handlePlayArtist}
                                onShuffle={handleShuffleArtist}
                                className="detail-page-actions artist-page-actions"
                                playLabel={`Reproducir canciones populares de ${artist.name}`}
                                pauseLabel={`Pausar ${artist.name}`}
                                playDisabled={popularSongs.length === 0}
                                shuffleDisabled={popularSongs.length === 0}
                            >
                                <FollowButton
                                    isFollowing={artist.is_following}
                                    onToggle={toggleFollow}
                                    loading={followLoading}
                                    size="md"
                                />
                            </DetailPlaybackActions>

                            {popularSongs.length > 0 && (
                                <section className="profile-section">
                                    <div className="section-header">
                                        <h2 className="saas-subtitle" style={{ margin: 0 }}>Canciones populares</h2>
                                    </div>
                                    <div className="tracks-list">
                                        {popularSongs.map((song, index) => (
                                            <TrackRow
                                                key={song.deezer_id}
                                                index={index}
                                                title={song.title}
                                                artist={song.artist?.name || artist.name}
                                                coverUrl={song.album?.cover_url}
                                                time={formatDuration(song.duration_ms)}
                                                plays={song.popularity ? `${song.popularity} pts` : ''}
                                                isPlaying={isPlaying && currentTrack?.deezer_id === song.deezer_id}
                                                onClick={() => play(song, popularSongs)}
                                                actions={
                                                    <button
                                                        onClick={(e) => handleAddClick(e, song)}
                                                        style={{
                                                            background: 'transparent', color: '#9ca3af', border: 'none',
                                                            fontSize: '1.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center',
                                                            justifyContent: 'center', padding: '0 20px', transition: 'color 0.2s'
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                                                        onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                                                    >
                                                        ⊕
                                                    </button>
                                                }
                                            />
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
        </div>
    );
};

export default ArtistDetail;