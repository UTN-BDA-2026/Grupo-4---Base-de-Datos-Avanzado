const TrackRow = ({ index, title, artist, album, time, plays }) => {
    return (
        <div className="track-item">
            <div className="track-number">{index + 1}</div>
            <div className="track-thumb"></div>
            <div className="track-details">
                <h4>{title}</h4>
                <p>{artist}</p>
            </div>
            <div className="track-album">{album}</div>
            <div className="track-plays">{plays}</div>
            <div className="track-time">{time}</div>
        </div>
    );
};

export default TrackRow;