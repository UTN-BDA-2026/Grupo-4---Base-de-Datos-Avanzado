import NowPlayingIndicator from './NowPlayingIndicator';
import { ACCENT_COLOR, ACCENT_BG_HIGHLIGHT } from '../constants/theme';

const TrackRow = ({ index, title, artist, album, coverUrl, time, plays, isPlaying, onClick, actions }) => {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.();
        }
    };

    return (
        <div
            className="track-item"
            onClick={onClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-pressed={isPlaying}
            style={{
                cursor: 'pointer',
                backgroundColor: isPlaying ? ACCENT_BG_HIGHLIGHT : 'transparent',
                borderRadius: '8px',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <div className="track-number" style={{ order: 1 }}>{index + 1}</div>

            <div className="track-thumb" style={{ position: 'relative', order: 2 }}>
                {coverUrl ? <img src={coverUrl} alt={album} /> : null}
                {isPlaying && <NowPlayingIndicator size={20} />}
            </div>

            <div className="track-details" style={{ order: 3, flex: 1 }}>
                <h4 style={{ color: isPlaying ? ACCENT_COLOR : 'white' }}>{title}</h4>
                <p>{artist}</p>
            </div>

            {album !== undefined ? (
                <div className="track-album" style={{ order: 5 }}>{album}</div>
            ) : plays !== undefined && plays !== '' ? (
                <div className="track-album" style={{ order: 5 }}>{plays}</div>
            ) : null}

            {album !== undefined && plays !== undefined && plays !== '' && (
                <div className="track-plays" style={{ order: 4, minWidth: '80px', textAlign: 'center' }}>
                    {plays}
                </div>
            )}

            <div className="track-time" style={{ order: 6 }}>{time}</div>

            {actions && (
                <div onClick={(e) => e.stopPropagation()} style={{ order: 7 }}>
                    {actions}
                </div>
            )}
        </div>
    );
};

export default TrackRow;