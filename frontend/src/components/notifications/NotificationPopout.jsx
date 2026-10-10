import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Trash2,
  Check,
  Sparkles,
  Shield,
  Clock,
  ExternalLink,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { useApp } from '../../context/AppContext';
import './NotificationPopout.css';

export function NotificationPopout({ isOpen, onClose }) {
  const popoutRef = useRef(null);
  const {
    notifications,
    unreadCount,
    loading,
    markRead,
    markAllRead,
    removeNotification,
    fetchNotifications,
  } = useNotifications();

  const { showToast } = useApp();
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'UNREAD'
  const [desktopEnabled, setDesktopEnabled] = useState(
    typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
  );

  // Close on outside click or Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (popoutRef.current && !popoutRef.current.contains(e.target)) {
        // Check if click was on the bell button itself
        if (e.target.closest('.notif-btn')) return;
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Request browser desktop notification permission
  const requestDesktopPermission = async () => {
    if (!('Notification' in window)) {
      showToast('Browser does not support desktop notifications', 'error');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setDesktopEnabled(true);
        showToast('Desktop notifications enabled!', 'success');
        new Notification('My AI-Scheduler', {
          body: 'Desktop notifications are active! You will receive study alerts.',
          icon: '/favicon.svg',
        });
      } else {
        setDesktopEnabled(false);
        showToast('Notification permission was denied', 'info');
      }
    } catch (err) {
      console.error('Desktop notification request failed:', err);
    }
  };

  // Test popout notification
  const handleSendTestNotification = () => {
    showToast('🚀 New Study Reminder: Time for your daily LeetCode practice block!', 'success');
    if (desktopEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Study Sanctuary Reminder', {
        body: 'Time to solve your daily algorithm problem on LeetCode Practice Playground!',
        icon: '/favicon.svg',
      });
    }
  };

  if (!isOpen) return null;

  const filteredList = filter === 'UNREAD'
    ? notifications.filter((n) => !n.isRead)
    : notifications;

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'AI_INSIGHT':
        return <Sparkles size={15} className="cat-icon icon-ai" />;
      case 'REMINDER':
        return <Clock size={15} className="cat-icon icon-reminder" />;
      case 'SYSTEM':
        return <Shield size={15} className="cat-icon icon-system" />;
      default:
        return <Bell size={15} className="cat-icon icon-default" />;
    }
  };

  return (
    <div className="notification-popout-card" ref={popoutRef}>
      {/* Header */}
      <div className="popout-header">
        <div className="popout-title-row">
          <div className="popout-title-group">
            <Bell size={18} className="bell-title-icon" />
            <span className="popout-title">Notifications</span>
            {unreadCount > 0 && (
              <span className="popout-unread-pill">{unreadCount} New</span>
            )}
          </div>
          <button className="popout-close-btn" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {/* Toolbar & Filter */}
        <div className="popout-toolbar">
          <div className="popout-filter-tabs">
            <button
              className={`filter-tab ${filter === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilter('ALL')}
            >
              All ({notifications.length})
            </button>
            <button
              className={`filter-tab ${filter === 'UNREAD' ? 'active' : ''}`}
              onClick={() => setFilter('UNREAD')}
            >
              Unread ({unreadCount})
            </button>
          </div>

          <div className="popout-header-actions">
            {!desktopEnabled ? (
              <button
                className="action-icon-btn"
                onClick={requestDesktopPermission}
                title="Enable OS Desktop Notifications"
              >
                <VolumeX size={15} />
              </button>
            ) : (
              <span className="desktop-active-indicator" title="Desktop alerts active">
                <Volume2 size={15} />
              </span>
            )}

            {unreadCount > 0 && (
              <button
                className="action-icon-btn mark-all-btn"
                onClick={markAllRead}
                title="Mark all as read"
              >
                <CheckCheck size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notification Items List */}
      <div className="popout-items-list">
        {loading ? (
          <div className="popout-loading">Loading notifications...</div>
        ) : filteredList.length === 0 ? (
          <div className="popout-empty">
            <div className="empty-bell-icon">
              <Bell size={28} />
            </div>
            <p className="empty-title">All caught up!</p>
            <span className="empty-subtitle">
              {filter === 'UNREAD' ? 'No unread notifications' : 'No notifications yet'}
            </span>
          </div>
        ) : (
          filteredList.map((notif) => (
            <div
              key={notif.id}
              className={`popout-item-row ${notif.isRead ? 'read' : 'unread'}`}
              onClick={() => !notif.isRead && markRead(notif.id)}
            >
              <div className="item-icon-box">{getCategoryIcon(notif.category)}</div>

              <div className="item-body">
                <div className="item-header-line">
                  <span className="item-title">{notif.title}</span>
                  <span className="item-time">
                    {notif.createdAt
                      ? new Date(notif.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Just now'}
                  </span>
                </div>
                <p className="item-message">{notif.message}</p>
              </div>

              <div className="item-actions" onClick={(e) => e.stopPropagation()}>
                {!notif.isRead && (
                  <button
                    className="item-action-btn mark-btn"
                    onClick={() => markRead(notif.id)}
                    title="Mark as read"
                  >
                    <Check size={14} />
                  </button>
                )}
                <button
                  className="item-action-btn del-btn"
                  onClick={() => removeNotification(notif.id)}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="popout-footer">
        <button
          className="test-popout-btn"
          onClick={handleSendTestNotification}
          title="Trigger a live notification popup"
        >
          <Sparkles size={13} />
          <span>Test Popout</span>
        </button>

        <Link to="/notifications" className="view-all-link" onClick={onClose}>
          <span>View All in Full Page</span>
          <ExternalLink size={12} />
        </Link>
      </div>
    </div>
  );
}

export default NotificationPopout;
