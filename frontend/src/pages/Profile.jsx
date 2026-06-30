import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import ProfileHeader from '../components/ProfileHeader';
import ArtistCard from '../components/ArtistCard';
import TrackRow from '../components/TrackRow';
import PlayerBar from '../components/PlayerBar';
import LogoutModal from '../components/LogoutModal';
import BackButton from '../components/BackButton';
import '../index.css';

const topArtists = [
    { id: 1, name: 'Soda Stereo', type: 'Artista' },
    { id: 2, name: 'Charly García', type: 'Artista' },
    { id: 3, name: 'Daft Punk', type: 'Artista' },
    { id: 4, name: 'The Weeknd', type: 'Artista' },
    { id: 5, name: 'Gustavo Cerati', type: 'Artista' },
];

const topTracks = [
    { id: 1, title: 'De Música Ligera', artist: 'Soda Stereo', album: 'Canción Animal', time: '3:32', plays: '142 reproducciones' },
    { id: 2, title: 'Nos Siguen Pegando Abajo', artist: 'Charly García', album: 'Clics Modernos', time: '3:25', plays: '98 reproducciones' },
    { id: 3, title: 'Instant Crush', artist: 'Daft Punk', album: 'Random Access Memories', time: '5:38', plays: '87 reproducciones' },
    { id: 4, title: 'Crimen', artist: 'Gustavo Cerati', album: 'Ahí vamos', time: '3:48', plays: '76 reproducciones' },
];

const Profile = () => {
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('resumen');
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogoutConfirm = async () => {
        await logout();
        navigate('/login');
    };

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
                                <button
                                    className={`profile-tab ${activeTab === 'playlists' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('playlists')}
                                >
                                    Playlists
                                </button>
                            </div>

                            <section className="profile-section">
                                <div className="section-header">
                                    <h2 className="saas-subtitle" style={{ margin: 0 }}>Tus artistas del mes</h2>
                                    <a href="#" className="see-all-link">Mostrar todos</a>
                                </div>
                                <div className="artists-grid">
                                    {topArtists.map((artist) => (
                                        <ArtistCard key={artist.id} name={artist.name} type={artist.type} />
                                    ))}
                                </div>
                            </section>

                            <section className="profile-section">
                                <div className="section-header">
                                    <h2 className="saas-subtitle" style={{ margin: 0 }}>Canciones más escuchadas</h2>
                                    <a href="#" className="see-all-link">Mostrar todas</a>
                                </div>
                                <div className="tracks-list">
                                    {topTracks.map((track, index) => (
                                        <TrackRow
                                            key={track.id}
                                            index={index}
                                            title={track.title}
                                            artist={track.artist}
                                            album={track.album}
                                            time={track.time}
                                            plays={track.plays}
                                        />
                                    ))}
                                </div>
                            </section>

                        </div>
                    </div>
                </main>
            </div>

            <PlayerBar track={{ title: 'De Música Ligera', artist: 'Soda Stereo' }} />

            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogoutConfirm}
            />
        </div>
    );
};

export default Profile;
