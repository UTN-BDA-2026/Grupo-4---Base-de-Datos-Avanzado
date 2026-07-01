import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSearch } from '../hooks/useSearch';
import Sidebar from '../components/Sidebar';
import LogoutModal from '../components/LogoutModal';
import SearchFilters from '../components/SearchFilters';
import SearchResults from '../components/SearchResults';
import '../index.css';

const Search = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const [query, setQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const { results, loading, error } = useSearch(query);

    const handleLogoutConfirm = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="saas-container">
            <div className="app-background"></div>
            <div className="glass-overlay"></div>

            <div className="saas-workspace">
                <Sidebar user={user} onLogoutClick={() => setShowLogoutModal(true)} />

                <main className="saas-main-panel">
                    <div className="saas-content-scroll">
                        <div className="content-wrapper" style={{ textAlign: 'left', padding: '2rem 3rem', maxWidth: '1200px', margin: '0' }}>

                            <div style={{ marginBottom: '2rem', maxWidth: '500px' }}>
                                <input
                                    type="text"
                                    className="custom-input"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="¿Qué quieres escuchar hoy?"
                                    autoFocus
                                    style={{
                                        width: '100%', padding: '12px 20px', borderRadius: '50px',
                                        fontSize: '1.1rem', backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <SearchFilters
                                query={query}
                                activeFilter={activeFilter}
                                setActiveFilter={setActiveFilter}
                            />

                            {loading && <p style={{ color: '#9ca3af' }}>Buscando...</p>}

                            {error && (
                                <p style={{ color: '#f87171' }}>No se pudo completar la búsqueda. Intentá de nuevo.</p>
                            )}

                            {!loading && !error && (
                                <SearchResults
                                    results={results}
                                    activeFilter={activeFilter}
                                    query={query}
                                    navigate={navigate}
                                />
                            )}
                        </div>
                    </div>
                </main>
            </div>
            <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={handleLogoutConfirm} />
        </div>
    );
};

export default Search;