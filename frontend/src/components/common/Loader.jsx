import './Loader.css';

export function Loader({ size = 'md', message = 'Loading...', fullPage = false }) {
  const content = (
    <div className={`loader-container loader-${size}`}>
      <div className="spinner-ring"></div>
      {message && <p className="loader-message">{message}</p>}
    </div>
  );

  if (fullPage) {
    return <div className="loader-fullpage">{content}</div>;
  }

  return content;
}

export default Loader;
