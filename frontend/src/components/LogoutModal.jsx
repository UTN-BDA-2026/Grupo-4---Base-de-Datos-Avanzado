import '../index.css';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="glass-modal">
                <div className="modal-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                </div>
                <h3 className="modal-title">¿Cerrar sesión?</h3>
                <p className="modal-text">Tendrás que volver a ingresar tus credenciales la próxima vez que quieras acceder a Identidad Sonora.</p>
                <div className="modal-actions">
                    <button className="btn-glass" onClick={onClose}>Cancelar</button>
                    {}
                    <button className="btn-danger-fill" onClick={onConfirm}>Salir</button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;