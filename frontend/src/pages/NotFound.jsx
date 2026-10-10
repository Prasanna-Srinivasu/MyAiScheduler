import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Home } from 'lucide-react';
import './NotFound.css';

export function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-code">404</div>
      <h2 className="notfound-title">Page Not Found</h2>
      <p className="notfound-desc">
        The route you are trying to access doesn't exist or has been relocated.
      </p>
      <Link to="/dashboard">
        <Button variant="primary" icon={<Home size={16} />}>
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}

export default NotFound;
