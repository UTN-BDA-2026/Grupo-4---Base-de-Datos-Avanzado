const NowPlayingIndicator = ({ size = 20 }) => {
    return (
        <div style={{
            position: 'absolute', inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            borderRadius: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            <svg width={size} height={size} viewBox="0 0 24 24" fill="#5eead4">
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
    );
};

export default NowPlayingIndicator;