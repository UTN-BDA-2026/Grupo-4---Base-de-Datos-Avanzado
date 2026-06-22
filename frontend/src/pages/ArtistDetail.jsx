import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import PlayerBar from '../components/PlayerBar';
import api from '../services/api';
import '../index.css';

const ArtistDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [artistData, setArtistData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtistDetail = async () => {
            try {
                const { data } = await api.get(`/artists/${id}/`); 
                setArtistData(data);
            } catch (error) {
                setArtistData({
                    id: id,
                    name: 'The Weeknd',
                    followers: '108,453,211',
                    verified: true,
                    topTracks: [
                        { id: 101, title: 'Blinding Lights', album: 'After Hours', duration: '3:20' },
                        { id: 102, title: 'Starboy', album: 'Starboy', duration: '3:50' },
                        { id: 103, title: 'Save Your Tears', album: 'After Hours', duration: '3:35' },
                        { id: 104, title: 'Die For You', album: 'Starboy', duration: '4:20' }
                    ],
                    albums: [
                        { id: 201, title: 'Dawn FM', year: '2022' },
                        { id: 202, title: 'After Hours', year: '2020' },
                        { id: 203, title: 'Starboy', year: '2016' }
                    ]
                });
            } finally {
                setLoading(false);
            }
        };

        fetchArtistDetail();
    }, [id]);

    if (loading) return <div className="saas-container" style={{ backgroundColor: '#050505' }}></div>;

    return (
        <div className="saas-container">
            <div className="app-background"></div>
            <div className="glass-overlay"></div>

            <div className="saas-workspace">
                <Sidebar user={user} />

                <main className="saas-main-panel">
                    <div className="saas-content-scroll">
                        <div className="content-wrapper" style={{ textAlign: 'left', padding: '2rem 3rem', maxWidth: '1200px', margin: '0' }}>
                            
                            <button 
                                onClick={() => navigate(-1)} 
                                style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                            >
                                ← Volver
                            </button>

                            <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap' }}>
                                <div style={{ 
                                    width: '200px', height: '200px', 
                                    background: 'linear-gradient(135deg, #111, #333)', 
                                    borderRadius: '50%', boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
                                    border: '2px solid rgba(255,255,255,0.1)'
                                }}></div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    {artistData?.verified && (
                                        <span style={{ color: '#5eead4', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            Artista Verificado
                                        </span>
                                    )}
                                    <h1 style={{ color: 'white', fontSize: '5rem', margin: '0', fontWeight: '900', lineHeight: '1', letterSpacing: '-2px' }}>
                                        {artistData?.name}
                                    </h1>
                                    <span style={{ color: '#9ca3af', fontSize: '1rem', marginTop: '10px' }}>
                                        <strong style={{ color: 'white' }}>{artistData?.followers}</strong> seguidores mensuales
                                    </span>
                                </div>
                            </div>

                            <section style={{ marginBottom: '3rem' }}>
                                <h2 className="saas-subtitle" style={{ marginBottom: '1.5rem', color: 'white', fontSize: '1.5rem' }}>Top Canciones</h2>
                                <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '10px' }}>
                                    {artistData?.topTracks?.map((track, index) => (
                                        <div 
                                            key={track.id} 
                                            onClick={() => navigate(`/cancion/${track.id}`)} 
                                            style={{ 
                                                display: 'grid', gridTemplateColumns: '40px 1fr 1fr 60px', alignItems: 'center',
                                                padding: '12px 15px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <span style={{ color: '#9ca3af' }}>{index + 1}</span>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ color: 'white', fontWeight: '500' }}>{track.title}</span>
                                                <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{artistData.name}</span>
                                            </div>
                                            <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>{track.album}</span>
                                            <span style={{ color: '#9ca3af', fontSize: '0.9rem', textAlign: 'right' }}>{track.duration}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h2 className="saas-subtitle" style={{ marginBottom: '1.5rem', color: 'white', fontSize: '1.5rem' }}>Discografía</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
                                    {artistData?.albums?.map((album) => (
                                        <div key={album.id} style={{ 
                                            backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', padding: '15px',
                                            cursor: 'pointer', border: '1px solid rgba(255, 255, 255, 0.05)', transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'}
                                        >
                                            <div style={{ width: '100%', aspectRatio: '1/1', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', borderRadius: '8px', marginBottom: '12px' }}></div>
                                            <h3 style={{ margin: 0, color: 'white', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{album.title}</h3>
                                            <p style={{ margin: '5px 0 0 0', color: '#9ca3af', fontSize: '0.85rem' }}>{album.year} • Álbum</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                        </div>
                    </div>
                </main>
            </div>
            <PlayerBar track={{ title: artistData?.topTracks?.[0]?.title || '', artist: artistData?.name || '' }} />
        </div>
    );
};

export default ArtistDetail;