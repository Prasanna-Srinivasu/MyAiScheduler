import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, Sun, Moon, Sparkles, Flame } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../context/AppContext';
import { useNotifications } from '../../hooks/useNotifications';
import { formatDisplayDate } from '../../utils/dateUtils';
import NotificationPopout from '../notifications/NotificationPopout';
import './Navbar.css';

export function Navbar() {
  const { user } = useAuth();
  const { theme, toggleTheme, setSidebarOpen } = useApp();
  const { unreadCount } = useNotifications();
  const [notifPopoutOpen, setNotifPopoutOpen] = useState(false);

  return (
    <header className="app-navbar">
      <div className="navbar-left">
        <button
          className="menu-toggle-btn"
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <Menu size={22} />
        </button>
        <div className="navbar-date-tag">
          <span className="current-date-text">{formatDisplayDate(new Date())}</span>
        </div>
        <div className="navbar-study-streak">
          <Flame size={15} className="navbar-flame" />
          <span>Study Sanctuary Active</span>
        </div>
      </div>

      <div className="navbar-right">
        <Link to="/ai-scheduler" className="quick-ai-btn" title="AI Schedule Generator">
          <Sparkles size={16} />
          <span>AI Schedule</span>
        </Link>

        <button
          className="navbar-icon-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Interactive Notifications Popout Trigger */}
        <div className="notif-wrapper" style={{ position: 'relative' }}>
          <button
            className={`navbar-icon-btn notif-btn ${notifPopoutOpen ? 'active' : ''}`}
            onClick={() => setNotifPopoutOpen((prev) => !prev)}
            title="Notifications & Study Reminders"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </button>

          <NotificationPopout
            isOpen={notifPopoutOpen}
            onClose={() => setNotifPopoutOpen(false)}
          />
        </div>

        <Link to="/profile" className="navbar-avatar-link" title="My Profile">
          <div className="nav-avatar">
            {user?.pictureUrl ? (
              <img
                src={user.pictureUrl}
                alt={user.name || 'User'}
                className="nav-avatar-img"
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              user?.name ? user.name.charAt(0).toUpperCase() : 'U'
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
