import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../context/PlayerContext';

const VolumeControl = () => {
    const [volume, setVolume] = useState(72);
    const [isVolumeOpen, setIsVolumeOpen] = useState(false);
    const volumeRef = useRef(null);

    useEffect(() => {
        if (!isVolumeOpen) return;

        const handleClickOutside = (event) => {
            if (volumeRef.current && !volumeRef.current.contains(event.target)) {
                setIsVolumeOpen(false);
            }
        };

        document.addEventListener('pointerdown', handleClickOutside);
        return () => document.removeEventListener('pointerdown', handleClickOutside);
    }, [isVolumeOpen]);

    const handleVolumeChange = (event) => {
        setVolume(Number(event.target.value));
    };

    return (
        <div className="volume-control" ref={volumeRef}>
            <div className={`volume-popover ${isVolumeOpen ? 'open' : ''}`} aria-hidden={!isVolumeOpen}>
                <input
                    className="volume-slider"
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    style={{ '--volume-level': `${volume}%` }}
                    aria-label="Volumen"
                    tabIndex={isVolumeOpen ? 0 : -1}
                />
            </div>

            <button
                className={`icon-btn volume-btn ${isVolumeOpen ? 'active' : ''}`}
                onClick={() => setIsVolumeOpen((prev) => !prev)}
                aria-label={volume === 0 ? 'Volumen silenciado' : 'Control de volumen'}
                aria-expanded={isVolumeOpen}
            >
                {volume === 0 ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <line x1="23" y1="9" x2="17" y2="15"></line>
                        <line x1="17" y1="9" x2="23" y2="15"></line>
                    </svg>
                ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M15.5 8.5a5 5 0 0 1 0 7"></path>
                        <path d="M19 5a9 9 0 0 1 0 14"></path>
                    </svg>
                )}
            </button>
        </div>
    );
};

const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
};

const PlayerBar = () => {
    const { currentTrack, isPlaying, progress, duration, togglePlay, seek } = usePlayer();
    const [repeat, setRepeat] = useState(0);
    const [shuffle, setShuffle] = useState(false);

    const handleRepeat = () => {
        setRepeat((prev) => (prev + 1) % 3);
    };

    const handleShuffle = () => {
        setShuffle((prev) => !prev);
    };

    const elapsed = (progress / 100) * duration;
    const remaining = duration - elapsed;

    return (
        <div className="saas-player-capsule">
            {/* Información de la pista */}
            <div className="player-track">
                <div
                    className="track-art"
                    style={currentTrack?.album?.cover_url ? {
                        backgroundImage: `url(${currentTrack.album.cover_url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    } : undefined}
                />
                <div className="track-meta">
                    <h4>{currentTrack?.title || '—'}</h4>
                    <p>{currentTrack?.artist?.name || '—'}</p>
                </div>
            </div>

            {/* Controles centrales */}
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
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="19 20 9 12 19 4 19 20"></polygon>
                        <line x1="5" y1="19" x2="5" y2="5"></line>
                    </svg>
                </button>

                {/* Play / Pause */}
                <button
                    className="play-btn"
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                >
                    {isPlaying ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                            <rect x="14" y="4" width="4" height="16" rx="1"></rect>
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" aria-hidden="true">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                    )}
                </button>

                {/* Next */}
                <button className="icon-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="5 4 15 12 5 20 5 4"></polygon>
                        <line x1="19" y1="5" x2="19" y2="19"></line>
                    </svg>
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

            {/* Línea de tiempo */}
            <div className="player-timeline">
                <span>{formatTime(elapsed)}</span>
                <div
                    className="timeline-bar"
                    onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const percent = ((e.clientX - rect.left) / rect.width) * 100;
                        seek(percent);
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    <div
                        className="timeline-progress"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <span>-{formatTime(remaining)}</span>
                <VolumeControl />
            </div>
        </div>
    );
};

export default PlayerBar;