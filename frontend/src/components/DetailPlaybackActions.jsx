const PlayIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="black" aria-hidden="true">
        <path d="M6 4l15 8-15 8V4z" />
    </svg>
);

const PauseIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="black" aria-hidden="true">
        <rect x="6" y="4" width="4" height="16" rx="1"></rect>
        <rect x="14" y="4" width="4" height="16" rx="1"></rect>
    </svg>
);

const ShuffleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="16 3 21 3 21 8"></polyline>
        <line x1="4" y1="20" x2="21" y2="3"></line>
        <polyline points="21 16 21 21 16 21"></polyline>
        <line x1="15" y1="15" x2="21" y2="21"></line>
        <line x1="4" y1="4" x2="9" y2="9"></line>
    </svg>
);

const DetailPlaybackActions = ({
    isPlaying,
    shuffleActive,
    onPlayToggle,
    onShuffle,
    className = '',
    playLabel = 'Reproducir',
    pauseLabel = 'Pausar',
    shuffleLabel = 'Reproduccion aleatoria',
    playDisabled = false,
    shuffleDisabled = false,
    children,
}) => {
    const playbackLabel = isPlaying ? pauseLabel : playLabel;

    return (
        <div className={`detail-actions ${className}`.trim()}>
            <button className="detail-play-btn" type="button" onClick={onPlayToggle} aria-label={playbackLabel} title={playbackLabel} disabled={playDisabled}>
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button className={`detail-icon-btn ${shuffleActive ? 'active' : ''}`} type="button" onClick={onShuffle} aria-label={shuffleLabel} title={shuffleLabel} disabled={shuffleDisabled}>
                <ShuffleIcon />
            </button>
            {children}
        </div>
    );
};

export default DetailPlaybackActions;
