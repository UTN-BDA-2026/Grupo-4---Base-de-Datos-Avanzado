const FollowButton = ({ isFollowing, onToggle, loading = false, size = 'md' }) => {
    const sizes = {
        sm: { padding: '5px 14px', fontSize: '0.85rem' },
        md: { padding: '8px 22px', fontSize: '0.9rem' },
    };

    return (
        <button
            onClick={onToggle}
            disabled={loading}
            style={{
                background: isFollowing ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '20px',
                cursor: loading ? 'default' : 'pointer',
                fontWeight: '600',
                opacity: loading ? 0.6 : 1,
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                ...sizes[size],
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.borderColor = 'white')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)')}
        >
            {isFollowing ? 'Siguiendo' : 'Seguir'}
        </button>
    );
};

export default FollowButton;