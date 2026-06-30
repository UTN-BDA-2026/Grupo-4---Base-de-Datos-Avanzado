const RecentlyPlayedCard = ({ title, artist, cover, onClick, isPlaying }) => {
    return (
        <div className="feed-card" onClick={onClick} style={{ cursor: 'pointer' }}>
            <div
                className="feed-art"
                style={cover ? { backgroundImage: `url(${cover})` } : undefined}
            >
                {isPlaying && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.45)',
                        borderRadius: 'inherit',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        {/* Ícono de ondas animadas */}
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="#5eead4">
                            <rect x="2"  y="10" width="3" height="10" rx="1.5">
                                <animate attributeName="height" values="4;12;4" dur="0.8s" repeatCount="indefinite" begin="0s"/>
                                <animate attributeName="y"      values="10;6;10" dur="0.8s" repeatCount="indefinite" begin="0s"/>
                            </rect>
                            <rect x="7"  y="6"  width="3" height="14" rx="1.5">
                                <animate attributeName="height" values="8;16;8" dur="0.8s" repeatCount="indefinite" begin="0.15s"/>
                                <animate attributeName="y"      values="8;4;8"  dur="0.8s" repeatCount="indefinite" begin="0.15s"/>
                            </rect>
                            <rect x="12" y="4"  width="3" height="16" rx="1.5">
                                <animate attributeName="height" values="12;20;12" dur="0.8s" repeatCount="indefinite" begin="0.3s"/>
                                <animate attributeName="y"      values="6;2;6"   dur="0.8s" repeatCount="indefinite" begin="0.3s"/>
                            </rect>
                            <rect x="17" y="6"  width="3" height="14" rx="1.5">
                                <animate attributeName="height" values="8;16;8" dur="0.8s" repeatCount="indefinite" begin="0.45s"/>
                                <animate attributeName="y"      values="8;4;8"  dur="0.8s" repeatCount="indefinite" begin="0.45s"/>
                            </rect>
                        </svg>
                    </div>
                )}
            </div>
            <div className="feed-info">
                <h4 style={{ color: isPlaying ? '#5eead4' : 'white' }}>{title}</h4>
                <p>{artist}</p>
            </div>
        </div>
    );
};

export default RecentlyPlayedCard;