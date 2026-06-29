import React from 'react';

const SearchFilters = ({ query, activeFilter, setActiveFilter }) => {
    if (query.trim() === '') return null;

    return (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '2.5rem' }}>
            {['all', 'songs', 'artists', 'albums', 'playlists'].map((filter) => (
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
                    {filter === 'all' ? 'Todo' : filter === 'songs' ? 'Canciones' : filter === 'artists' ? 'Artistas' : filter === 'albums' ? 'Álbumes' : 'Playlists'}
                </button>
            ))}
        </div>
    );
};

export default SearchFilters;