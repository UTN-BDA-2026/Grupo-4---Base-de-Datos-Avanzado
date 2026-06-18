const ErrorMessage = ({ message }) => {
    if (!message) return null;
    return <p style={{ color: '#f87171', marginBottom: '1rem' }}>{message}</p>;
};

export default ErrorMessage;