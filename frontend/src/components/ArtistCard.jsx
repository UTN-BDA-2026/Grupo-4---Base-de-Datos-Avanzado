const ArtistCard = ({ name, type }) => {
    return (
        <div className="artist-card">
            <div className="artist-art"></div>
            <h4>{name}</h4>
            <p>{type}</p>
        </div>
    );
};

export default ArtistCard;