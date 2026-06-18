const FeedCard = ({ title, artist }) => {
    return (
        <div className="feed-card">
            <div className="feed-art"></div>
            <div className="feed-info">
                <h4>{title}</h4>
                <p>{artist}</p>
            </div>
        </div>
    );
};

export default FeedCard;