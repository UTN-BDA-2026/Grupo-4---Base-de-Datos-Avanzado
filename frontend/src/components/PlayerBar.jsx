import React, { useState } from 'react';

const PlayerBar = ({ track }) => {
    // Estados para los botones
    const [repeat, setRepeat] = useState(0);
    const [shuffle, setShuffle] = useState(false);

    const handleRepeat = () => {
        setRepeat((prev) => (prev + 1) % 3);
    };

    const handleShuffle = () => {
        setShuffle(!shuffle);
    };

    // Fallback de seguridad por si track no llega
    const currentTrack = track || { title: "Sin título", artist: "Desconocido" };

    return (
        <div className="saas-player-capsule">
            {/* Información de la pista - Usando la clase original */}
            <div className="player-track">
                <div className="track-art"></div>
                <div className="track-meta">
                    <h4>{currentTrack.title}</h4>
                    <p>{currentTrack.artist}</p>
                </div>
            </div>

            {/* Controles centrales - Usando la clase original */}
            <div className="player-controls">
                {/* Repetición (Loop) */}
                <button 
                    className={`icon-btn repeat-btn ${repeat !== 0 ? 'active' : ''}`} 
                    onClick={handleRepeat}
                >
                    {repeat === 2 ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="17 1 21 5 17 9"></polyline>
                            <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                            <polyline points="7 23 3 19 7 15"></polyline>
                            <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                            <text x="12" y="16" fontFamily="sans-serif" fontSize="8" fontWeight="bold" textAnchor="middle" stroke="none" fill="currentColor">1</text>
                        </svg>
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="17 1 21 5 17 9"></polyline>
                            <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                            <polyline points="7 23 3 19 7 15"></polyline>
                            <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                        </svg>
                    )}
                </button>

                {/* Previous */}
                <button className="icon-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
                </button>
                
                {/* Play */}
                <button className="play-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                </button>
                
                {/* Next */}
                <button className="icon-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
                </button>
                
                {/* Aleatorio (Shuffle) */}
                <button 
                    className={`icon-btn shuffle-btn ${shuffle ? 'active' : ''}`} 
                    onClick={handleShuffle}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 3 21 3 21 8"></polyline>
                        <line x1="4" y1="20" x2="21" y2="3"></line>
                        <polyline points="21 16 21 21 16 21"></polyline>
                        <line x1="15" y1="15" x2="21" y2="21"></line>
                        <line x1="4" y1="4" x2="9" y2="9"></line>
                    </svg>
                </button>
            </div>

            {/* Línea de tiempo - Usando la clase original */}
            <div className="player-timeline">
                <span>1:42</span>
                <div className="timeline-bar">
                    <div className="timeline-progress"></div>
                </div>
                <span>-1:50</span>
            </div>
        </div>
    );
};

export default PlayerBar;