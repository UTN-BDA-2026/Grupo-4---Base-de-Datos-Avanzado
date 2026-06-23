const ALBUM_TYPE_LABELS = {
    album: 'Álbum',
    single: 'Sencillo',
    ep: 'EP',
    compile: 'Compilación',
};

const AlbumCard = ({ title, artist, cover, albumType, onClick }) => {
    return (
        <div className="feed-card" onClick={onClick}>
            <div
                className="feed-art"
                style={cover ? { backgroundImage: `url(${cover})` } : undefined}
            ></div>
            <div className="feed-info">
                <h4>{title}</h4>
                <p>{artist}</p>
                {albumType && <span className="album-type-tag">{ALBUM_TYPE_LABELS[albumType] || albumType}</span>}
            </div>
        </div>
    );
};

export default AlbumCard;