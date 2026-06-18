const SearchBar = ({ value, onChange, placeholder = 'Buscar artistas, canciones, álbumes o podcasts...' }) => {
    return (
        <div className="search-pill-container">
            <div className="saas-search-pill">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
            </div>
        </div>
    );
};

export default SearchBar;