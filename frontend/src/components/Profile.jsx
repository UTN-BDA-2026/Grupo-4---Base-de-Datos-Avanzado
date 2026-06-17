import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const Profile = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

                    <div className="sidebar-bottom" ref={profileRef}>
                        <button 
                            className="saas-nav-btn active" 
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                        >
                            <div className="profile-avatar">V</div>
                            <span className="sidebar-text">Perfil</span>
                        </button>

                        {isProfileOpen && (
                            <div className="profile-popover">
                                <div className="popover-header">
                                    <h4>Victoria</h4>
                                    <p>Suscripción Premium</p>
                                </div>
                                <div className="popover-body">
                                    <button>Editar perfil</button>
                                    <button>Preferencias</button>
                                    <button>Configuración</button>
                                    <div className="divider"></div>
                                    <button className="danger" onClick={() => navigate('/login')}>Cerrar sesión</button>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

                <main className="saas-main-panel">
                    <div className="saas-content-scroll">
                        <div className="content-wrapper">
                            
                            <section className="profile-hero">
                                <div className="profile-avatar-large">V</div>
                                <div className="profile-info">
                                    <span className="profile-label">Perfil verificado</span>
                                    <h1 className="profile-name">Victoria Sanchez</h1>
                                    <p className="profile-stats">
                                        <strong>12</strong> Playlists Públicas &nbsp;•&nbsp; <strong>48</strong> Seguidores &nbsp;•&nbsp; <strong>12</strong> Siguiendo
                                    </p>
                                </div>
                            </section>

                            <div className="profile-tabs">
                                <button className="profile-tab active">Resumen</button>
                                <button className="profile-tab">Playlists</button>
                                <button className="profile-tab">Siguiendo</button>
                                <button className="profile-tab">Seguidores</button>
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
        </div>
    );
};

export default Profile;