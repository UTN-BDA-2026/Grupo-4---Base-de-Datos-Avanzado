import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const Home = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => navigate('/login');

    return (
        <div className="saas-container">
            {/* Fondo Ambiental */}
            <div className="saas-ambient-bg">
                <div className="glow glow-emerald"></div>
                <div className="glow glow-petrol"></div>
            </div>

            {/* Espacio de trabajo (Arc Browser style) */}
            <div className="saas-workspace">
                
                {/* 1. SIDEBAR FLOTANTE */}
                <aside className="saas-sidebar">
                    <div className="saas-brand">
                        <div className="brand-logo">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                        </div>
                        <span>Identidad Sonora</span>
                    </div>

                    <div className="saas-nav-section">
                        <span className="nav-label">Explorar</span>
                        <nav className="saas-nav">
                            <a href="#" className="active">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                                Inicio
                            </a>
                            <a href="#">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                Buscar
                            </a>
                            <a href="#">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                Descubrir
                            </a>
                        </nav>
                    </div>

                    <div className="saas-nav-section">
                        <span className="nav-label">Colección</span>
                        <nav className="saas-nav">
                            <a href="#">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                Favoritos
                            </a>
                            <a href="#">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="21.17" y1="8" x2="12" y2="8"></line><line x1="3.95" y1="6.06" x2="8.54" y2="14"></line><line x1="10.88" y1="21.94" x2="15.46" y2="14"></line></svg>
                                Mixes
                            </a>
                        </nav>
                    </div>

                    <div className="saas-sidebar-footer">
                        <div className="status-indicator">
                            <div className="dot"></div>
                            <span>Sincronizado</span>
                        </div>
                    </div>
                </aside>

                {/* 2. PANEL PRINCIPAL */}
                <main className="saas-main-panel">
                    <header className="saas-header">
                        <div className="saas-search-pill">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input type="text" placeholder="Buscar artistas, canciones o podcasts..." />
                        </div>

                        <div className="saas-profile-container">
                            <button className="saas-profile-pill" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                <div className="avatar">V</div>
                                <span>Victoria</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </button>

                            {isDropdownOpen && (
                                <div className="saas-dropdown">
                                    <button>Ajustes de cuenta</button>
                                    <button>Conexiones API</button>
                                    <div className="divider"></div>
                                    <button className="danger" onClick={handleLogout}>Cerrar sesión</button>
                                </div>
                            )}
                        </div>
                    </header>

                    <div className="saas-content-scroll">
                        <h1 className="saas-title">Para ti</h1>

                        <div className="saas-card-grid">
                            {/* Tarjeta 1 */}
                            <div className="saas-card">
                                <div className="card-art gradient-1"></div>
                                <h3>Flow de Código</h3>
                                <p>Electrónica profunda para programar.</p>
                            </div>
                            
                            {/* Tarjeta 2 */}
                            <div className="saas-card">
                                <div className="card-art gradient-2"></div>
                                <h3>Rock Nacional 2026</h3>
                                <p>Tus clásicos actualizados.</p>
                            </div>

                            {/* Tarjeta 3 */}
                            <div className="saas-card">
                                <div className="card-art gradient-3"></div>
                                <h3>Bases de Datos Hoy</h3>
                                <p>Podcast • Último episodio</p>
                            </div>

                            {/* Tarjeta de Acción */}
                            <div className="saas-card action-card">
                                <div className="action-circle">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                </div>
                                <h3>Crear Mix</h3>
                                <p>Con IA Sonora</p>
                            </div>
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
                    <button className="icon-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
                    </button>
                    <button className="play-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    </button>
                    <button className="icon-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
                    </button>
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