import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useHomeData } from '../hooks/useHomeData';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import RecentlyPlayedCard from '../components/RecentlyPlayedCard';
import ArtistCard from '../components/ArtistCard';
import AlbumCard from '../components/AlbumCard';
import PlayerBar from '../components/PlayerBar';
import LogoutModal from '../components/LogoutModal';
import { getGreeting } from '../utils/greeting';
import '../index.css';

const Home = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const { recentlyPlayed, topArtists, topAlbums, loading } = useHomeData();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [showAllRecent, setShowAllRecent] = useState(false);
    const [showAllArtists, setShowAllArtists] = useState(false);
    const [showAllAlbums, setShowAllAlbums] = useState(false);

    const INITIAL_LIMIT = 12;

    const handleLogoutConfirm = async () => {
        await logout();
        navigate('/login');
    };

    const currentTrack = recentlyPlayed[0]
        ? { title: recentlyPlayed[0].title, artist: recentlyPlayed[0].artist?.name }
        : { title: 'Sin reproducción', artist: '—' };

    const visibleRecent = showAllRecent ? recentlyPlayed : recentlyPlayed.slice(0, INITIAL_LIMIT);
    const visibleArtists = showAllArtists ? topArtists : topArtists.slice(0, INITIAL_LIMIT);
    const visibleAlbums = showAllAlbums ? topAlbums : topAlbums.slice(0, INITIAL_LIMIT);

    const viewAllBtnStyle = {
        background: 'none',
        border: 'none',
        color: '#1db954',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '0.9rem'
    };

    return (
        <div className="saas-container">
            <div className="app-background"></div>
            <div className="glass-overlay"></div>

            <div className="saas-workspace">
                <Sidebar
                    user={user}
                    onLogoutClick={() => setShowLogoutModal(true)}
                />

                <main className="saas-main-panel">
                    <div className="saas-content-scroll">
                        <div className="content-wrapper">

                            <SearchBar
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            <h1 className="saas-title">{getGreeting()}</h1>

                            {loading && <p>Cargando tu música...</p>}

                            {recentlyPlayed.length > 0 && (
                                <section style={{ marginBottom: '2.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <h2 className="saas-subtitle" style={{ margin: 0 }}>Escuchado Recientemente</h2>
                                        {recentlyPlayed.length > INITIAL_LIMIT && (
                                            <button 
                                                onClick={() => setShowAllRecent(!showAllRecent)}
                                                style={viewAllBtnStyle}
                                            >
                                                {showAllRecent ? 'Ver menos' : 'Ver todo'}
                                            </button>
                                        )}
                                    </div>
                                    <div className="compact-grid">
                                        {visibleRecent.map((song) => (
                                            <RecentlyPlayedCard
                                                key={song.deezer_id}
                                                title={song.title}
                                                artist={song.artist?.name}
                                                cover={song.album?.cover_url}
                                                onClick={() => {/* reproducir */}}
                                            />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {topArtists.length > 0 && (
                                <section style={{ marginBottom: '2.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <h2 className="saas-subtitle" style={{ margin: 0 }}>Artistas Destacados</h2>
                                        {topArtists.length > INITIAL_LIMIT && (
                                            <button 
                                                onClick={() => setShowAllArtists(!showAllArtists)}
                                                style={viewAllBtnStyle}
                                            >
                                                {showAllArtists ? 'Ver menos' : 'Ver todo'}
                                            </button>
                                        )}
                                    </div>
                                    <div className="compact-grid">
                                        {visibleArtists.map((artist) => (
                                            <ArtistCard
                                                key={artist.deezer_id}
                                                name={artist.name}
                                                followers={artist.followers}
                                                image={artist.image_url}
                                                onClick={() => navigate(`/artist/${artist.deezer_id}`)}
                                            />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {topAlbums.length > 0 && (
                                <section style={{ marginBottom: '2.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <h2 className="saas-subtitle" style={{ margin: 0 }}>Álbumes Populares</h2>
                                        {topAlbums.length > INITIAL_LIMIT && (
                                            <button 
                                                onClick={() => setShowAllAlbums(!showAllAlbums)}
                                                style={viewAllBtnStyle}
                                            >
                                                {showAllAlbums ? 'Ver menos' : 'Ver todo'}
                                            </button>
                                        )}
                                    </div>
                                    <div className="compact-grid">
                                        {visibleAlbums.map((album) => (
                                            <AlbumCard
                                                key={album.deezer_id}
                                                title={album.name}
                                                artist={album.artist?.name}
                                                cover={album.cover_url}
                                                albumType={album.album_type}
                                                onClick={() => navigate(`/album/${album.deezer_id}`)}
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
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogoutConfirm}
            />
        </div>
    );
};

export default Home;