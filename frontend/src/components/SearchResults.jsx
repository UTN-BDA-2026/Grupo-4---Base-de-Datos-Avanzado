import React from 'react';
import { formatDuration } from '../utils/formatDuration';
import { useLibraryActions } from '../hooks/useLibraryActions';
import AddToPlaylistModal from './AddToPlaylistModal';
import FollowButton from './FollowedButton';
import Toast from './Toast';

const SearchResults = ({ results, activeFilter, query, navigate }) => {
    const { 
        playlists, 
        modal, 
        loading, 
        toast, 
        openModal, 
        closeModal, 
        addSongToPlaylist,
        handleToggleSaveAlbum,
        handleToggleFollowArtist,
        followOverrides,
    } = useLibraryActions();

    const isArtistFollowed = (artist) => 
        followOverrides[artist.deezer_id] !== undefined 
            ? followOverrides[artist.deezer_id] 
            : !!artist.is_following;

    const getUnifiedResults = () => {
        const unified = [];
        if (results.songs) results.songs.forEach(song => unified.push({ ...song, type: 'song' }));
        if (results.albums) results.albums.forEach(album => unified.push({ ...album, type: 'album' }));
        if (results.artists) results.artists.forEach(artist => unified.push({ ...artist, type: 'artist' }));
        if (results.playlists) results.playlists.forEach(playlist => unified.push({ ...playlist, type: 'playlist' }));
        return unified;
    };

    const handleAddClick = async (e, item) => {
        e.stopPropagation();
        if (item.type === 'song') {
            openModal({ id: item.id, title: item.title });
        } else if (item.type === 'album') {
            const albumId = item.deezer_id || item.id;
            await handleToggleSaveAlbum(albumId);
        }
    };

    const handleFollowClick = (e, artist) => {
        e.stopPropagation();
        handleToggleFollowArtist(artist.deezer_id, isArtistFollowed(artist));
    };

    if (activeFilter === 'all') {
        const unifiedList = getUnifiedResults();
        if (unifiedList.length === 0 && query.trim() !== '') return null;

        return (
            <>
                <Toast toast={toast} />

                {modal.open && (
                    <AddToPlaylistModal
                        playlists={playlists}
                        item={modal.item}
                        loading={loading}
                        onSelect={addSongToPlaylist}
                        onClose={closeModal}
                    />
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    <section>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {unifiedList.map((item) => {
                                let title = '';
                                let subtitle = '';
                                let imageUrl = 'rgba(255, 255, 255, 0.08)';
                                let isRound = false;
                                let redirectUrl = '';

                                if (item.type === 'song') {
                                    title = item.title;
                                    subtitle = `Canción • ${item.artist?.name || 'Artista'}`;
                                    imageUrl = item.album?.cover_url ? `url(${item.album.cover_url}) center/cover` : imageUrl;
                                    redirectUrl = `/album/${item.album?.deezer_id}`;
                                } else if (item.type === 'album') {
                                    title = item.name;
                                    subtitle = `Álbum • ${item.artist?.name || 'Artista'}`;
                                    imageUrl = item.cover_url ? `url(${item.cover_url}) center/cover` : 'linear-gradient(135deg, #8b5cf6, #5eead4)';
                                    redirectUrl = `/album/${item.deezer_id}`;
                                } else if (item.type === 'artist') {
                                    title = item.name;
                                    subtitle = 'Artista';
                                    imageUrl = item.image_url ? `url(${item.image_url}) center/cover` : 'linear-gradient(135deg, #5eead4, #3b82f6)';
                                    isRound = true;
                                    redirectUrl = `/artist/${item.deezer_id}`;
                                } else if (item.type === 'playlist') {
                                    title = item.name;
                                    subtitle = `Playlist • ${item.total_songs || 0} canciones`;
                                    imageUrl = item.cover_url ? `url(${item.cover_url}) center/cover` : 'linear-gradient(135deg, #3b82f6, #8b5cf6)';
                                    redirectUrl = `/playlist/${item.id}`;
                                }

                                return (
                                    <div
                                        key={`${item.type}-${item.deezer_id || item.id}`}
                                        style={{
                                            display: 'grid', gridTemplateColumns: '48px 1fr auto auto', alignItems: 'center', gap: '20px',
                                            padding: '10px 15px', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px',
                                            cursor: 'pointer', transition: 'all 0.2s'
                                        }}
                                        onClick={() => navigate(redirectUrl)}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'}
                                    >
                                        <div style={{
                                            width: '48px', height: '48px', flexShrink: 0,
                                            borderRadius: isRound ? '50%' : '6px',
                                            background: imageUrl,
                                        }} />

                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ color: 'white', fontWeight: '500', fontSize: '1rem' }}>{title}</span>
                                            <span style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '4px' }}>{subtitle}</span>
                                        </div>

                                        <div>
                                            <span style={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#d1d5db',
                                                padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600',
                                                textTransform: 'capitalize'
                                            }}>
                                                {item.type === 'song' ? 'Canción' : item.type === 'album' ? 'Álbum' : item.type === 'artist' ? 'Artista' : 'Playlist'}
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', minWidth: '70px', justifyContent: 'flex-end' }}>
                                            {item.type === 'artist' ? (
                                                <FollowButton
                                                    isFollowing={isArtistFollowed(item)}
                                                    onToggle={(e) => handleFollowClick(e, item)}
                                                    size="sm"
                                                />
                                            ) : item.type !== 'playlist' ? (
                                                <button
                                                    onClick={(e) => handleAddClick(e, item)}
                                                    style={{
                                                        background: 'transparent', color: '#9ca3af', border: 'none',
                                                        fontSize: '1.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center',
                                                        justifyContent: 'center', padding: '0 8px', transition: 'color 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                                                    onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                                                >
                                                    ⊕
                                                </button>
                                            ) : null}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>
            </>
        );
    }

    return (
        <>
            <Toast toast={toast} />

            {modal.open && (
                <AddToPlaylistModal
                    playlists={playlists}
                    item={modal.item}
                    loading={loading}
                    onSelect={addSongToPlaylist}
                    onClose={closeModal}
                />
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

                {activeFilter === 'songs' && results.songs.length > 0 && (
                    <section>
                        <h2 className="saas-subtitle" style={{ marginBottom: '1rem', color: 'white' }}>Canciones</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {results.songs.map((song) => (
                                <div
                                    key={song.deezer_id}
                                    style={{
                                        display: 'grid', gridTemplateColumns: '48px 1fr 1fr auto 60px', alignItems: 'center', gap: '14px',
                                        padding: '10px 15px', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px',
                                        cursor: 'pointer', border: '1px solid transparent', transition: 'all 0.2s'
                                    }}
                                    onClick={() => navigate(`/album/${song.album?.deezer_id}`)}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'}
                                >
                                    <div style={{ width: '48px', height: '48px', borderRadius: '6px', flexShrink: 0, background: song.album?.cover_url ? `url(${song.album.cover_url}) center/cover` : 'rgba(255, 255, 255, 0.08)' }} />
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ color: 'white', fontWeight: '500' }}>{song.title}</span>
                                        <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{song.artist?.name}</span>
                                    </div>
                                    <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>{song.album?.name || 'Sencillo'}</span>
                                    <button
                                        onClick={(e) => handleAddClick(e, { ...song, type: 'song' })}
                                        style={{
                                            background: 'transparent', color: '#9ca3af', border: 'none',
                                            fontSize: '1.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', padding: '0 8px', transition: 'color 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                                    >
                                        ⊕
                                    </button>
                                    <span style={{ color: '#9ca3af', fontSize: '0.9rem', textAlign: 'right' }}>{formatDuration(song.duration_ms)}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {activeFilter === 'artists' && results.artists.length > 0 && (
                    <section>
                        <h2 className="saas-subtitle" style={{ marginBottom: '1rem', color: 'white' }}>Artistas</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' }}>
                            {results.artists.map((artist) => (
                                <div
                                    key={artist.deezer_id}
                                    onClick={() => navigate(`/artist/${artist.deezer_id}`)}
                                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', padding: '15px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.05)', cursor: 'pointer' }}
                                >
                                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto 12px auto', background: artist.image_url ? `url(${artist.image_url}) center/cover` : 'linear-gradient(135deg, #5eead4, #3b82f6)' }} />
                                    <h3 style={{ margin: 0, color: 'white', fontSize: '1rem' }}>{artist.name}</h3>
                                    <div style={{ marginTop: '10px' }}>
                                        <FollowButton
                                            isFollowing={isArtistFollowed(artist)}
                                            onToggle={(e) => handleFollowClick(e, artist)}
                                            size="sm"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {activeFilter === 'albums' && results.albums.length > 0 && (
                    <section>
                        <h2 className="saas-subtitle" style={{ marginBottom: '1rem', color: 'white' }}>Álbumes</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' }}>
                            {results.albums.map((album) => (
                                <div
                                    key={album.deezer_id}
                                    onClick={() => navigate(`/album/${album.deezer_id}`)}
                                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', padding: '15px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.05)', cursor: 'pointer', position: 'relative' }}
                                >
                                    <div style={{ width: '100px', height: '100px', borderRadius: '8px', margin: '0 auto 12px auto', background: album.cover_url ? `url(${album.cover_url}) center/cover` : 'linear-gradient(135deg, #8b5cf6, #5eead4)' }} />
                                    <h3 style={{ margin: 0, color: 'white', fontSize: '1rem' }}>{album.name}</h3>
                                    <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: '0.85rem' }}>{album.artist?.name}</p>
                                    
                                    <button
                                        onClick={(e) => handleAddClick(e, { ...album, type: 'album' })}
                                        style={{
                                            marginTop: '10px', background: 'transparent', color: '#9ca3af', border: 'none',
                                            fontSize: '1.4rem', cursor: 'pointer', transition: 'color 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                                    >
                                        ⊕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {activeFilter === 'playlists' && results.playlists?.length > 0 && (
                    <section>
                        <h2 className="saas-subtitle" style={{ marginBottom: '1rem', color: 'white' }}>Playlists</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' }}>
                            {results.playlists.map((playlist) => (
                                <div
                                    key={playlist.id}
                                    onClick={() => navigate(`/playlist/${playlist.id}`)}
                                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', padding: '15px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.05)', cursor: 'pointer' }}
                                >
                                    <div style={{ width: '100px', height: '100px', borderRadius: '8px', margin: '0 auto 12px auto', background: playlist.cover_url ? `url(${playlist.cover_url}) center/cover` : 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }} />
                                    <h3 style={{ margin: 0, color: 'white', fontSize: '1rem' }}>{playlist.name}</h3>
                                    <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: '0.85rem' }}>{playlist.total_songs} canciones {!playlist.is_public && '· Privada'}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </>
    );
};

export default SearchResults;