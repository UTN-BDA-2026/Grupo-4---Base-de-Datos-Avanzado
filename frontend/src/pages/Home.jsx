import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import HeroCard from '../components/HeroCard';
import FeedCard from '../components/FeedCard';
import PlayerBar from '../components/PlayerBar';
import LogoutModal from '../components/LogoutModal';
import '../index.css';

const heroItems = [
    { id: 1, title: 'Flow de Código', description: 'Electrónica profunda para programar.', variant: 'teal' },
    { id: 2, title: 'Rock Nacional 2026', description: 'Tus clásicos actualizados.', variant: 'purple' },
    { id: 3, title: 'Bases de Datos Hoy', description: 'Podcast • Último episodio', variant: 'orange' },
];

const feedItems = [
    { id: 1, title: 'Midnight City', artist: 'M83' },
    { id: 2, title: 'Starboy', artist: 'The Weeknd' },
    { id: 3, title: 'Random Access Memories', artist: 'Daft Punk' },
    { id: 4, title: 'Currents', artist: 'Tame Impala' },
];

const Home = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

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
                    onLogoutClick={() => setShowLogoutModal(true)}
                />

                <main className="saas-main-panel">
                    <div className="saas-content-scroll">
                        <div className="content-wrapper">

                            <SearchBar
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            <section className="hero-section">
                                <h1 className="saas-title">Para ti</h1>
                                <div className="saas-hero-grid">
                                    {heroItems.map((item) => (
                                        <HeroCard
                                            key={item.id}
                                            title={item.title}
                                            description={item.description}
                                            variant={item.variant}
                                        />
                                    ))}
                                </div>
                            </section>

                            <section className="feed-section">
                                <h2 className="saas-subtitle">Continuar escuchando</h2>
                                <div className="compact-grid">
                                    {feedItems.map((item) => (
                                        <FeedCard key={item.id} title={item.title} artist={item.artist} />
                                    ))}
                                </div>
                            </section>

                        </div>
                    </div>
                </main>
            </div>

            <PlayerBar track={{ title: 'De Música Ligera', artist: 'Soda Stereo' }} />

            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogoutConfirm}
            />
        </div>
    );
};

export default Home;