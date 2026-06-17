import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const Home = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(true); 
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
            {/* Fondo con imagen, desenfoque extremo y oscurecido */}
            <div className="app-background"></div>
            <div className="glass-overlay"></div>

            <div className="saas-workspace">
                
                {/* 1. SIDEBAR DINÁMICA */}
                <aside className="saas-sidebar">
                    <div className="sidebar-top">
                        <div className="saas-brand">
                            <div className="brand-logo">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                            </div>
                            <span className="sidebar-text">Identidad Sonora</span>
                        </div>

                        <nav className="saas-nav">
                            <a href="#" className="active">
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
                            className={`saas-nav-btn ${isProfileOpen ? 'active' : ''}`} 
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                        >
                            <div className="profile-avatar">V</div>
                            <span className="sidebar-text">Perfil</span>
                        </button>

                        {/* Menú de Perfil Flotante */}
                        {isProfileOpen && (
                            <div className="profile-popover">
                                <div className="popover-header">
                                    <h4>Victoria</h4>
                                    <p>Suscripción Premium</p>
                                </div>
                                <div className="popover-body">
                                    {isAuthenticated ? (
                                        <>
                                            <button>Información del usuario</button>
                                            <button>Editar perfil</button>
                                            <button>Preferencias</button>
                                            <button>Configuración</button>
                                            <button>Tema visual</button>
                                            <div className="divider"></div>
                                            <button className="danger" onClick={() => navigate('/login')}>Cerrar sesión</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => navigate('/login')}>Iniciar sesión</button>
                                            <button onClick={() => navigate('/registro')}>Registrarse</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

                {/* 2. PANEL PRINCIPAL */}
                <main className="saas-main-panel">
                    <div className="saas-content-scroll">
                        
                        {/* Envoltorio para centrar todo el contenido */}
                        <div className="content-wrapper">
                            
                            {/* Búsqueda expandida y centrada */}
                            <div className="search-pill-container">
                                <div className="saas-search-pill">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                    <input type="text" placeholder="Buscar artistas, canciones, álbumes o podcasts..." />
                                </div>
                            </div>

                            {/* Contenido Hero */}
                            <section className="hero-section">
                                <h1 className="saas-title">Para ti</h1>
                                <div className="saas-hero-grid">
                                    <div className="hero-card card-teal">
                                        <h3>Flow de Código</h3>
                                        <p>Electrónica profunda para programar.</p>
                                    </div>
                                    <div className="hero-card card-purple">
                                        <h3>Rock Nacional 2026</h3>
                                        <p>Tus clásicos actualizados.</p>
                                    </div>
                                    <div className="hero-card card-orange">
                                        <h3>Bases de Datos Hoy</h3>
                                        <p>Podcast • Último episodio</p>
                                    </div>
                                </div>
                            </section>

                            {/* Continuar escuchando */}
                            <section className="feed-section">
                                <h2 className="saas-subtitle">Continuar escuchando</h2>
                                <div className="compact-grid">
                                    {[
                                        { id: 1, title: 'Midnight City', artist: 'M83' },
                                        { id: 2, title: 'Starboy', artist: 'The Weeknd' },
                                        { id: 3, title: 'Random Access Memories', artist: 'Daft Punk' },
                                        { id: 4, title: 'Currents', artist: 'Tame Impala' },
                                    ].map((item) => (
                                        <div key={item.id} className="feed-card">
                                            <div className="feed-art"></div>
                                            <div className="feed-info">
                                                <h4>{item.title}</h4>
                                                <p>{item.artist}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                        </div>
                    </div>
                </main>

            </div>

            {/* 3. REPRODUCTOR CÁPSULA */}
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

export default Home;