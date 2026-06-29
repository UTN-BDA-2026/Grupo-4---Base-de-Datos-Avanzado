const Toast = ({ toast }) => {
    if (!toast) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: toast.type === 'error' ? '#dc2626' : '#5eead4',
            color: toast.type === 'error' ? 'white' : 'black',
            padding: '12px 24px',
            borderRadius: '50px',
            fontWeight: '600',
            fontSize: '0.95rem',
            boxShadow: toast.type === 'error'
                ? '0 10px 30px rgba(220, 38, 38, 0.3)'
                : '0 10px 30px rgba(94, 234, 212, 0.3)',
            zIndex: 10000,
            animation: 'fadeIn 0.3s ease'
        }}>
            {toast.type === 'error' ? '✕' : '✓'} {toast.message}
        </div>
    );
};

export default Toast;