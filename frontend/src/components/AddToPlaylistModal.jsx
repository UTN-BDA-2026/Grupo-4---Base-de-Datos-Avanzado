import React from 'react';

const AddToPlaylistModal = ({ playlists, item, loading, onSelect, onClose }) => {
    if (!item) return null;

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', 
                inset: 0, 
                backgroundColor: 'rgba(0, 0, 0, 0.7)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                zIndex: 9999, 
                backdropFilter: 'blur(5px)' 
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    backgroundColor: '#111',
                    borderRadius: '12px', 
                    padding: '25px', 
                    width: '100%', 
                    maxWidth: '400px', 
                    border: '1px solid rgba(94, 234, 212, 0.3)', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '16px',
                    animation: 'fadeIn 0.2s ease'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div>
                        <h2 style={{ margin: 0, color: 'white', fontSize: '1.4rem', fontWeight: 'bold' }}>
                            Agregar a playlist
                        </h2>
                        <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: '0.9rem' }}>
                            {item.title}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '1.5rem', cursor: 'pointer' }}
                    >
                        ✖
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto' }}>
                    {playlists.length === 0 && (
                        <p style={{ color: '#9ca3af', textAlign: 'center', padding: '20px 0' }}>
                            No tenés playlists creadas.
                        </p>
                    )}
                    {playlists.map((playlist) => (
                        <button
                            key={playlist.id}
                            disabled={loading}
                            onClick={() => onSelect(playlist.id, item.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '12px',
                                padding: '10px 12px', borderRadius: '8px', cursor: 'pointer',
                                backgroundColor: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                transition: 'all 0.2s ease', textAlign: 'left', width: '100%',
                                opacity: loading ? 0.6 : 1
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
                                e.currentTarget.style.borderColor = 'rgba(94, 234, 212, 0.4)'; 
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                            }}
                        >
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '6px', flexShrink: 0,
                                background: playlist.cover_url
                                    ? `url(${playlist.cover_url}) center/cover`
                                    : 'linear-gradient(135deg, #5eead4, #8b5cf6)' 
                            }} />
                            <div style={{ minWidth: 0, flex: 1 }}>
                                <p style={{ margin: 0, color: 'white', fontSize: '0.95rem', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {playlist.name}
                                </p>
                                <p style={{ margin: '2px 0 0', color: '#9ca3af', fontSize: '0.8rem' }}>
                                    {playlist.total_songs} canciones
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AddToPlaylistModal;