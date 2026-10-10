import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Sparkles,
  Calendar,
  Bell,
  User,
  Settings,
  LogOut,
  X,
  BookOpen,
  Code2,
  GraduationCap,
  Compass,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../context/AppContext';
import { useNotifications } from '../../hooks/useNotifications';
import './Sidebar.css';

export function Sidebar() {
  const { logout, user } = useAuth();
  const { sidebarOpen, setSidebarOpen } = useApp();
  const { unreadCount } = useNotifications();

  const navItems = [
    { to: '/practice', label: 'LeetCode Practice', icon: <Code2 size={20} />, badge: '110', badgeColor: 'badge-primary' },
    { to: '/roadmap-chat', label: 'Roadmap AI Chat', icon: <Compass size={20} />, badge: 'AI Tutor', badgeColor: 'badge-primary' },
    { to: '/courses', label: 'Courses & Topics', icon: <GraduationCap size={20} /> },
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
    { to: '/ai-scheduler', label: 'AI Scheduler', icon: <Sparkles size={20} />, badge: 'AI' },
    { to: '/calendar', label: 'Calendar', icon: <Calendar size={20} /> },
    {
      to: '/notifications',
      label: 'Notifications',
      icon: <Bell size={20} />,
      badge: unreadCount > 0 ? unreadCount : null,
      badgeColor: 'badge-danger',
    },
    { to: '/profile', label: 'Profile', icon: <User size={20} /> },
    { to: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <>
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`app-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-icon">
              <BookOpen size={22} />
            </div>
            <div className="brand-info">
              <span className="brand-name">My AI-Scheduler</span>
              <span className="brand-tagline">Study Sanctuary</span>
            </div>
          </div>
          <button
            className="sidebar-close-mobile"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link-active' : ''}`
              }
              onClick={() => {
                if (window.innerWidth <= 1024) setSidebarOpen(false);
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.badge && (
                <span className={`nav-badge ${item.badgeColor || 'badge-primary'}`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user-card">
            <div className="user-avatar">
              {user?.pictureUrl ? (
                <img src={user.pictureUrl} alt={user.name || 'User'} className="user-avatar-img" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                user?.name ? user.name.charAt(0).toUpperCase() : 'U'
              )}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name || 'Developer'}</span>
              <span className="user-role">{user?.targetRole || 'Full Stack'}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={logout} title="Sign Out">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
