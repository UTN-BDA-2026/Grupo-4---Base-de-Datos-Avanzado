const ProfileHeader = ({ user, onLogoutClick }) => {
    const initials = user?.username
        ? user.username.slice(0, 2).toUpperCase()
        : '??';

    return (
        <section className="profile-hero">
            <div className="profile-hero-left">
                <div className="profile-avatar-large">{initials}</div>
                <div className="profile-info">
                    <span className="profile-label">PERFIL</span>
                    <h1 className="profile-name">{user?.username || 'Usuario'}</h1>
                    <div className="profile-badges">
                        <span className="badge-dark">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            {user?.email || 'sin-email'}
                        </span>
                        <span className="badge-dark">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5eead4" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            Cuenta activa
                        </span>
                    </div>
                </div>
            </div>

            <button className="btn-logout" onClick={onLogoutClick}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Logout
            </button>
        </section>
    );
};

export default ProfileHeader;