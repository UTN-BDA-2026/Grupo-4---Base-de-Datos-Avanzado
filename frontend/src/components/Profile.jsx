import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutModal from './LogoutModal';
import '../index.css';

const Profile = () => {
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className="saas-container">
            <div className="app-background"></div>
            <div className="glass-overlay"></div>

            <div className="saas-workspace">
                <aside className="saas-sidebar">
                    <div className="sidebar-top">
                        <div className="saas-brand">
                            <div className="brand-logo">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                            </div>
                            <span className="sidebar-text">Identidad Sonora</span>
                        </div>

                        <nav className="saas-nav">
                            <a href="#" onClick={() => navigate('/home')}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                                <span className="sidebar-text">Inicio</span>
                            </a>
                            <a href="#">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                <span className="sidebar-text">Buscar</span>
                            </a>
                            <a href="#">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                                <span className="sidebar-text">Biblioteca</span>
                            </a>
                        </nav>
                    </div>

                    <div className="sidebar-bottom">
                        {/* El botón de perfil ahora navega directamente y ya no abre menús */}
                        <button 
                            className="saas-nav-btn active" 
                            onClick={() => navigate('/perfil')}
                        >
                            <div className="profile-avatar">AV</div>
                            <span className="sidebar-text">Perfil</span>
                        </button>
                    </div>
                </aside>

                <main className="saas-main-panel">
                    <div className="saas-content-scroll">
                        <div className="content-wrapper">
                            
                            {/* Cabecera del Perfil idéntica a la imagen */}
                            <section className="profile-hero">
                                <div className="profile-hero-left">
                                    <div className="profile-avatar-large">AV</div>
                                    <div className="profile-info">
                                        <span className="profile-label">PERFIL</span>
                                        <h1 className="profile-name">Victoria Sachez</h1>
                                        <div className="profile-badges">
                                            <span className="badge-dark">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                                Vicky@beats.com
                                            </span>
                                            <span className="badge-dark">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5eead4" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                                Cuenta activa
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Botón de Logout lateral */}
                                <button className="btn-logout" onClick={() => setIsLogoutModalOpen(true)}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                    Logout
                                </button>
                            </section>

                            <div className="profile-tabs">
                                <button className="profile-tab active">Resumen</button>
                                <button className="profile-tab">Playlists</button>
                            </div>

                            <section className="profile-section">
                                <div className="section-header">
                                    <h2 className="saas-subtitle" style={{ margin: 0 }}>Tus artistas del mes</h2>
                                    <a href="#" className="see-all-link">Mostrar todos</a>
                                </div>
                                <div className="artists-grid">
                                    {[
                                        { id: 1, name: 'Soda Stereo', type: 'Artista' },
                                        { id: 2, name: 'Charly García', type: 'Artista' },
                                        { id: 3, name: 'Daft Punk', type: 'Artista' },
                                        { id: 4, name: 'The Weeknd', type: 'Artista' },
                                        { id: 5, name: 'Gustavo Cerati', type: 'Artista' },
                                    ].map((artist) => (
                                        <div key={artist.id} className="artist-card">
                                            <div className="artist-art"></div>
                                            <h4>{artist.name}</h4>
                                            <p>{artist.type}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="profile-section">
                                <div className="section-header">
                                    <h2 className="saas-subtitle" style={{ margin: 0 }}>Canciones más escuchadas</h2>
                                    <a href="#" className="see-all-link">Mostrar todas</a>
                                </div>
                                <div className="tracks-list">
                                    {[
                                        { id: 1, title: 'De Música Ligera', artist: 'Soda Stereo', album: 'Canción Animal', time: '3:32', plays: '142 reproducciones' },
                                        { id: 2, title: 'Nos Siguen Pegando Abajo', artist: 'Charly García', album: 'Clics Modernos', time: '3:25', plays: '98 reproducciones' },
                                        { id: 3, title: 'Instant Crush', artist: 'Daft Punk', album: 'Random Access Memories', time: '5:38', plays: '87 reproducciones' },
                                        { id: 4, title: 'Crimen', artist: 'Gustavo Cerati', album: 'Ahí vamos', time: '3:48', plays: '76 reproducciones' },
                                    ].map((track, index) => (
                                        <div key={track.id} className="track-item">
                                            <div className="track-number">{index + 1}</div>
                                            <div className="track-thumb"></div>
                                            <div className="track-details">
                                                <h4>{track.title}</h4>
                                                <p>{track.artist}</p>
                                            </div>
                                            <div className="track-album">{track.album}</div>
                                            <div className="track-plays">{track.plays}</div>
                                            <div className="track-time">{track.time}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                        </div>
                    </div>
                </main>
            </div>

            <div className="saas-player-capsule">
                <div className="player-track">
                    <div className="track-art"></div>
                    <div className="track-meta">
                        <h4>De Música Ligera</h4>
                        <p>Soda Stereo</p>
                    </div>
                </div>

                <div className="player-controls">
                    <button className="icon-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg></button>
                    <button className="play-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></button>
                    <button className="icon-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg></button>
                </div>

                <div className="player-timeline">
                    <span>1:42</span>
                    <div className="timeline-bar">
                        <div className="timeline-progress"></div>
                    </div>
                    <span>-1:50</span>
                </div>
            </div>

            <LogoutModal 
                isOpen={isLogoutModalOpen} 
                onClose={() => setIsLogoutModalOpen(false)} 
                onConfirm={handleLogout} 
            />
        </div>
    );
};

export default Profile;