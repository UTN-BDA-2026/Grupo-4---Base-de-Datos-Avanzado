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
    
    // Estados para la búsqueda
    const [query, setQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all'); // all, tracks, artists, albums
    const [results, setResults] = useState({ tracks: [], artists: [], albums: [] });

    // Efecto para buscar en tiempo real cuando el usuario escribe
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.trim() !== '') {
                handleSearch();
            } else {
                // Si limpia el buscador, vaciamos resultados
                setResults({ tracks: [], artists: [], albums: [] });
            }
        }, 300); // 300ms de espera para no saturar al backend en cada letra

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSearch = async () => {
        try {
            // Revisa si tu backend usa /search/?q= o algo similar
            const { data } = await api.get(`/search/?q=${query}`);
            setResults({
                tracks: data.tracks || [],
                artists: data.artists || [],
                albums: data.albums || []
            });
        } catch (error) {
            console.error("Error al realizar la búsqueda:", error);
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

            <div className="saas-workspace">
                <Sidebar user={user} onLogoutClick={() => setShowLogoutModal(true)} />

                <main className="saas-main-panel">
                    <div className="saas-content-scroll">
                        <div className="content-wrapper" style={{ textAlign: 'left', padding: '2rem 3rem', maxWidth: '1200px', margin: '0' }}>
                            
                            {/* BARRA DE BÚSQUEDA INTEGRADA */}
                            <div style={{ marginBottom: '2rem', position: 'relative', maxWidth: '500px' }}>
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
                                        border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white'
                                    }}
                                />
                            </div>

                            {/* PÍLDORAS DE FILTROS ESTILO SPOTIFY */}
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

                            {/* RESULTADOS DE BÚSQUEDA */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                
                                {/* SECCIÓN CANCIONES */}
                                {(activeFilter === 'all' || activeFilter === 'tracks') && results.tracks.length > 0 && (
                                    <section className="feed-section">
                                        <h2 className="saas-subtitle" style={{ marginBottom: '1rem' }}>Canciones</h2>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {results.tracks.map((track) => (
                                                <div key={track.id} className="feature-item" style={{ 
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                    padding: '10px 20px', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                        <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '4px' }}></div>
                                                        <div>
                                                            <div style={{ color: 'white', fontWeight: '500' }}>{track.title}</div>
                                                            <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{track.artist_name}</div>
                                                        </div>
                                                    </div>
                                                    <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>{track.duration || '3:30'}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* SECCIÓN ARTISTAS */}
                                {(activeFilter === 'all' || activeFilter === 'artists') && results.artists.length > 0 && (
                                    <section className="feed-section">
                                        <h2 className="saas-subtitle" style={{ marginBottom: '1rem' }}>Artistas</h2>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' }}>
                                            {results.artists.map((artist) => (
                                                <div key={artist.id} style={{ 
                                                    backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', padding: '15px',
                                                    textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.05)'
                                                }}>
                                                    {/* Foto redonda para artistas */}
                                                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #5eead4, #3b82f6)', margin: '0 auto 12px auto' }}></div>
                                                    <h3 style={{ margin: 0, color: 'white', fontSize: '1rem' }}>{artist.name}</h3>
                                                    <p style={{ margin: '5px 0 0 0', color: '#9ca3af', fontSize: '0.85rem' }}>Artista</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* SECCIÓN ÁLBUMES */}
                                {(activeFilter === 'all' || activeFilter === 'albums') && results.albums.length > 0 && (
                                    <section className="feed-section">
                                        <h2 className="saas-subtitle" style={{ marginBottom: '1rem' }}>Álbumes</h2>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' }}>
                                            {results.albums.map((album) => (
                                                <div key={album.id} style={{ 
                                                    backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', padding: '15px',
                                                    border: '1px solid rgba(255, 255, 255, 0.05)'
                                                }}>
                                                    <div style={{ width: '100%', aspectRatio: '1/1', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', borderRadius: '6px', marginBottom: '12px' }}></div>
                                                    <h3 style={{ margin: 0, color: 'white', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{album.title}</h3>
                                                    <p style={{ margin: '5px 0 0 0', color: '#9ca3af', fontSize: '0.85rem' }}>{album.artist_name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* VISTA POR DEFECTO / BUSCADOR VACÍO */}
                                {query.trim() === '' && (
                                    <p style={{ color: '#9ca3af', fontSize: '1.1rem', marginTop: '2rem' }}>Explora canciones, artistas y álbumes escribiendo arriba.</p>
                                )}

                            </div>

                        </div>
                    </div>
                </main>
            </div>

            <PlayerBar track={{ title: 'Buscador de Señales', artist: 'Listo' }} />
            <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={handleLogoutConfirm} />
        </div>
    );
};

export default Search;