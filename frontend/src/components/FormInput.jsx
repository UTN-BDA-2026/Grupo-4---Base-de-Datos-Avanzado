const FormInput = ({ label, type = 'text', name, onChange, required = true }) => (
    <div className="input-group">
        <label>{label}</label>
        <input
            type={type}
            name={name}
            className="custom-input"
            onChange={onChange}
            required={required}
        />
    </div>
);

export default FormInput;