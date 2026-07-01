import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProfileData } from '../hooks/useProfileData';
import { usePlayer } from '../context/PlayerContext';
import Sidebar from '../components/Sidebar';
import ProfileHeader from '../components/ProfileHeader';
import ArtistCard from '../components/ArtistCard';
import TrackRow from '../components/TrackRow';
import RecentlyPlayedCard from '../components/RecentlyPlayedCard';
import PlayerBar from '../components/PlayerBar';
import LogoutModal from '../components/LogoutModal';
import BackButton from '../components/BackButton';
import { formatDuration } from '../utils/formatDuration';
import '../index.css';

const INITIAL_LIMIT = 10;
const ARTISTS_INITIAL_LIMIT = 12;

const viewAllBtnStyle = {
    background: 'none', border: 'none', color: '#5eead4',
    cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem'
};

const Profile = () => {
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('resumen');
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { topArtists, topTracks, recentlyPlayed, loading, error } = useProfileData();
    const { play, currentTrack, isPlaying } = usePlayer();

    const [showAllRecent, setShowAllRecent] = useState(false);
    const [showAllArtists, setShowAllArtists] = useState(false);
    const [showAllTracks, setShowAllTracks] = useState(false);

    const handleLogoutConfirm = async () => {
        await logout();
        navigate('/login');
    };

    const visibleRecent  = showAllRecent  ? recentlyPlayed : recentlyPlayed.slice(0, INITIAL_LIMIT);
    const visibleArtists = showAllArtists ? topArtists     : topArtists.slice(0, ARTISTS_INITIAL_LIMIT);
    const visibleTracks  = showAllTracks  ? topTracks      : topTracks.slice(0, INITIAL_LIMIT);

    return (
        <div className="saas-container">
            <div className="app-background"></div>
            <div className="glass-overlay"></div>

            <div className="saas-workspace">
                <Sidebar
                    user={user}
                    onLogoutClick={() => setIsLogoutModalOpen(true)}
                />

                <main className="saas-main-panel">
                    <div className="saas-content-scroll">
                        <div className="content-wrapper">
                            <BackButton />

                            <ProfileHeader
                                user={user}
                                onLogoutClick={() => setIsLogoutModalOpen(true)}
                            />

                            <div className="profile-tabs">
                                <button
                                    className={`profile-tab ${activeTab === 'resumen' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('resumen')}
                                >
                                    Resumen
                                </button>
                            </div>

                            {error && (
                                <p className="error-text">No se pudo cargar tu perfil.</p>
                            )}

                            {loading && <p>Cargando tu perfil...</p>}

                            {topArtists.length > 0 && (
                                <section style={{ marginBottom: '2.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <h2 className="saas-subtitle" style={{ margin: 0 }}>Tus artistas del mes</h2>
                                        {topArtists.length > ARTISTS_INITIAL_LIMIT && (
                                            <button onClick={() => setShowAllArtists(!showAllArtists)} style={viewAllBtnStyle}>
                                                {showAllArtists ? 'Ver menos' : 'Ver todo'}
                                            </button>
                                        )}
                                    </div>
                                    <div className="artists-grid">
                                        {visibleArtists.map((artist) => (
                                            <ArtistCard
                                                key={artist.deezer_id}
                                                name={artist.name}
                                                image={artist.image_url}
                                                type="Artista"
                                                onClick={() => navigate(`/artist/${artist.deezer_id}`)}
                                            />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {topTracks.length > 0 && (
                                <section className="profile-section">
                                    <div className="section-header">
                                        <h2 className="saas-subtitle" style={{ margin: 0 }}>Tus canciones más escuchadas</h2>
                                        {topTracks.length > INITIAL_LIMIT && (
                                            <button onClick={() => setShowAllTracks(!showAllTracks)} style={viewAllBtnStyle}>
                                                {showAllTracks ? 'Ver menos' : 'Mostrar todas'}
                                            </button>
                                        )}
                                    </div>
                                    <div className="tracks-list">
                                        {visibleTracks.map((track, index) => (
                                            <TrackRow
                                                key={track.id}
                                                index={index}
                                                title={track.title}
                                                artist={track.artist?.name}
                                                album={track.album?.name}
                                                coverUrl={track.album?.cover_url}
                                                time={formatDuration(track.duration_ms)}
                                                isPlaying={isPlaying && currentTrack?.deezer_id === track.deezer_id}
                                                onClick={() => play(track, topTracks)}
                                            />
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            <PlayerBar track={currentTrack} />

            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogoutConfirm}
            />
        </div>
    );
};

export default Profile;