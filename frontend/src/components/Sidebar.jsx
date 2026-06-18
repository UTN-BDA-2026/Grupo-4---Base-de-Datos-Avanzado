import { NavLink } from 'react-router-dom';

const Sidebar = ({ user, onLogoutClick }) => {
    const initial = user?.username ? user.username.charAt(0).toUpperCase() : '?';

    return (
        <aside className="saas-sidebar">
            <div className="sidebar-top">
                <div className="saas-brand">
                    <div className="brand-logo">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    </div>
                    <span className="sidebar-text">Identidad Sonora</span>
                </div>

                <nav className="saas-nav">
                    <NavLink to="/home" className={({ isActive }) => isActive ? 'active' : ''}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                        <span className="sidebar-text">Inicio</span>
                    </NavLink>

                    <NavLink to="/buscar" className={({ isActive }) => isActive ? 'active' : ''}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <span className="sidebar-text">Buscar</span>
                    </NavLink>

                    <NavLink to="/biblioteca" className={({ isActive }) => isActive ? 'active' : ''}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                        <span className="sidebar-text">Biblioteca</span>
                    </NavLink>
                </nav>
            </div>

            <div className="sidebar-bottom">
                <NavLink to="/perfil" className={({ isActive }) => `saas-nav-btn ${isActive ? 'active' : ''}`}>
                    <div className="profile-avatar">{initial}</div>
                    <span className="sidebar-text">Perfil</span>
                </NavLink>

                <button className="saas-nav-btn" onClick={onLogoutClick}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span className="sidebar-text">Salir</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;