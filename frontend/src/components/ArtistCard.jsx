const formatFollowers = (count) => {
    if (!count) return '0 seguidores';
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M seguidores`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K seguidores`;
    return `${count} seguidores`;
};

const ArtistCard = ({ name, followers, image, onClick }) => {
    return (
        <div className="artist-card" onClick={onClick}>
            <div
                className="artist-art"
                style={image ? { backgroundImage: `url(${image})` } : undefined}
            ></div>
            <h4>{name}</h4>
            <p>{formatFollowers(followers)}</p>
        </div>
    );
};

export default ArtistCard;