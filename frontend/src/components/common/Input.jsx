import './Input.css';

export function Input({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  helperText,
  icon,
  as = 'input',
  children,
  className = '',
  rows = 3,
  ...props
}) {
  const Component = as;

  return (
    <div className={`input-group ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label className="input-label" htmlFor={name}>
          {label} {required && <span className="required-asterisk">*</span>}
        </label>
      )}

      <div className="input-wrapper">
        {icon && <span className="input-icon-prefix">{icon}</span>}

        {as === 'select' ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`input-field select-field ${icon ? 'with-icon' : ''}`}
            {...props}
          >
            {children}
          </select>
        ) : as === 'textarea' ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className={`input-field textarea-field ${icon ? 'with-icon' : ''}`}
            {...props}
          />
        ) : (
          <input
            id={name}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`input-field ${icon ? 'with-icon' : ''}`}
            {...props}
          />
        )}
      </div>

      {error && <span className="input-error-msg">{error}</span>}
      {helperText && !error && <span className="input-helper-msg">{helperText}</span>}
    </div>
  );
}

export default Input;
