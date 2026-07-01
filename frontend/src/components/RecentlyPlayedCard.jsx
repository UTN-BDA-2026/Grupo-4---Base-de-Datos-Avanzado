import NowPlayingIndicator from './NowPlayingIndicator';
import { ACCENT_COLOR } from '../constants/theme';

const RecentlyPlayedCard = ({ title, artist, cover, onClick, isPlaying }) => {
    return (
        <div className="feed-card" onClick={onClick} style={{ cursor: 'pointer' }}>
            <div
                className="feed-art"
                style={cover ? { backgroundImage: `url(${cover})` } : undefined}
            >
                {isPlaying && <NowPlayingIndicator size={28} />}
            </div>
            <div className="feed-info">
                <h4 style={{ color: isPlaying ? ACCENT_COLOR : 'white' }}>{title}</h4>
                <p>{artist}</p>
            </div>
        </div>
    );
};

export default RecentlyPlayedCard;