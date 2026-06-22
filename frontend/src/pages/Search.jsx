import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import PlayerBar from '../components/PlayerBar';
import LogoutModal from '../components/LogoutModal';
import api from '../services/api';
import '../index.css';

const Search = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    
    const [query, setQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all'); 
    const [results, setResults] = useState({ tracks: [], artists: [], albums: [] });

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.trim() !== '') {
                handleSearch();
            } else {
                setResults({ tracks: [], artists: [], albums: [] });
            }
        }, 300); 
        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSearch = async (e) => {
        if (e) e.preventDefault(); 
        try {
            const { data } = await api.get(`/search/?q=${query}`);
            setResults({
                tracks: data.tracks || [],
                artists: data.artists || [],
                albums: data.albums || []
            });
        } catch (error) {
            setResults({
                tracks: [
                    { id: 1, title: 'Get Lucky', artist_name: 'Daft Punk', duration: '4:08', album: 'Random Access Memories' },
                    { id: 2, title: 'One More Time', artist_name: 'Daft Punk', duration: '5:20', album: 'Discovery' },
                    { id: 3, title: 'Around the World', artist_name: 'Daft Punk', duration: '7:09', album: 'Homework' }
                ],
                artists: [{ id: 1, name: 'Daft Punk' }],
                albums: [{ id: 1, title: 'Random Access Memories', artist_name: 'Daft Punk' }]
            });
        }
    };

    const handleLogoutConfirm = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="saas-container">
            <div className="app-background"></div>
            <div className="glass-overlay"></div>

            {}
            <div className="saas-workspace">
                <Sidebar user={user} onLogoutClick={() => setShowLogoutModal(true)} />

                <main className="saas-main-panel">
                    <div className="saas-content-scroll">
                        <div className="content-wrapper" style={{ textAlign: 'left', padding: '2rem 3rem', maxWidth: '1200px', margin: '0' }}>
                            
                            <div style={{ marginBottom: '2rem', maxWidth: '500px' }}>
                                <form onSubmit={handleSearch}>
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
                                </form>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginBottom: '2.5rem' }}>
                                {['all', 'tracks', 'artists', 'albums'].map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => setActiveFilter(filter)}
                                        style={{
                                            background: activeFilter === filter ? '#5eead4' : 'rgba(255, 255, 255, 0.05)',
                                            color: activeFilter === filter ? 'black' : 'white',
                                            border: 'none', padding: '8px 16px', borderRadius: '20px',
                                            cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s ease',
                                            textTransform: 'capitalize'
                                        }}
                                    >
                                        {filter === 'all' ? 'Todo' : filter === 'tracks' ? 'Canciones' : filter === 'artists' ? 'Artistas' : 'Álbumes'}
                                    </button>
                                ))}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                
                                {(activeFilter === 'all' || activeFilter === 'tracks') && results.tracks.length > 0 && (
                                    <section>
                                        <h2 className="saas-subtitle" style={{ marginBottom: '1rem', color: 'white' }}>Canciones</h2>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {results.tracks.map((track) => (
                                                <div 
                                                    key={track.id} 
                                                    onClick={() => navigate(`/cancion/${track.id}`)} 
                                                    style={{ 
                                                        display: 'grid', gridTemplateColumns: '40px 1fr 1fr 60px', alignItems: 'center',
                                                        padding: '10px 15px', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px',
                                                        cursor: 'pointer', border: '1px solid transparent', transition: 'all 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'}
                                                >
                                                    <span style={{ color: '#9ca3af' }}>{track.id}</span>
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span style={{ color: 'white', fontWeight: '500' }}>{track.title}</span>
                                                        <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{track.artist_name}</span>
                                                    </div>
                                                    <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>{track.album || 'Sencillo'}</span>
                                                    <span style={{ color: '#9ca3af', fontSize: '0.9rem', textAlign: 'right' }}>{track.duration}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {(activeFilter === 'all' || activeFilter === 'artists') && results.artists.length > 0 && (
                                    <section>
                                        <h2 className="saas-subtitle" style={{ marginBottom: '1rem', color: 'white' }}>Artistas</h2>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' }}>
                                            {results.artists.map((artist) => (
                                                <div key={artist.id} onClick={() => navigate(`/artista/${artist.id}`)} style={{ 
                                                    backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', padding: '15px',
                                                    textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.05)', cursor: 'pointer'
                                                }}>
                                                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #5eead4, #3b82f6)', margin: '0 auto 12px auto' }}></div>
                                                    <h3 style={{ margin: 0, color: 'white', fontSize: '1rem' }}>{artist.name}</h3>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {query.trim() === '' && (
                                    <p style={{ color: '#9ca3af', fontSize: '1.1rem', marginTop: '2rem' }}>Explora canciones, artistas y álbumes escribiendo arriba.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <PlayerBar track={{ title: 'Buscador', artist: 'Listo' }} />
            <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={handleLogoutConfirm} />
        </div>
    );
};

export default Search;