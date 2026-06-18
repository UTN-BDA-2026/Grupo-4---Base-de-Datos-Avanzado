const PlayerBar = ({ track }) => {
    return (
        <div className="saas-player-capsule">
            <div className="player-track">
                <div className="track-art"></div>
                <div className="track-meta">
                    <h4>{track.title}</h4>
                    <p>{track.artist}</p>
                </div>
            </div>

            <div className="player-controls">
                <button className="icon-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg></button>
                <button className="play-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></button>
                <button className="icon-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg></button>
            </div>

            <div className="player-timeline">
                <span>1:42</span>
                <div className="timeline-bar">
                    <div className="timeline-progress"></div>
                </div>
                <span>-1:50</span>
            </div>
        </div>
    );
};

export default PlayerBar;