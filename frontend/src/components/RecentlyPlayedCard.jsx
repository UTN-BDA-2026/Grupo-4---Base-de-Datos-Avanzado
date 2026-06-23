const RecentlyPlayedCard = ({ title, artist, cover, popularity, onClick }) => {
    return (
        <div className="feed-card" onClick={onClick}>
            <div
                className="feed-art"
                style={cover ? { backgroundImage: `url(${cover})` } : undefined}
            ></div>
            <div className="feed-info">
                <h4>{title}</h4>
                <p>{artist}</p>
            </div>
        </div>
    );
};

export default RecentlyPlayedCard;