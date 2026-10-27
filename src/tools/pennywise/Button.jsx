
import './Button.css';

// Basic Button Component
const Button = ({ children, onClick, disabled = false, type = 'button', className = '', ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`custom-button ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Primary Button Component
const PrimaryButton = ({ children, onClick, disabled = false, ...props }) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="primary-button"
      {...props}
    >
      {children}
    </Button>
  );
};

// Secondary Button Component
const SecondaryButton = ({ children, onClick, disabled = false, ...props }) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="secondary-button"
      {...props}
    >
      {children}
    </Button>
  );
};

// Danger Button Component
const DangerButton = ({ children, onClick, disabled = false, ...props }) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="danger-button"
      {...props}
    >
      {children}
    </Button>
  );
};

// Icon Button Component
const IconButton = ({ icon, children, onClick, disabled = false, ...props }) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="icon-button"
      {...props}
    >
      {icon && <span className="icon">{icon}</span>}
      {children}
    </Button>
  );
};

export { Button, PrimaryButton, SecondaryButton, DangerButton, IconButton };
export default Button; 