import { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationList } from '../components/notifications/NotificationList';
import './NotificationsPage.css';

export function NotificationsPage() {
  const {
    notifications,
    loading,
    markRead,
    markAllRead,
    removeNotification,
  } = useNotifications();

  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);

  const displayedNotifications = filterUnreadOnly
    ? notifications.filter((n) => !n.isRead)
    : notifications;

  return (
    <div className="notifications-page-container">
      <div className="notif-page-header">
        <div>
          <h2 className="page-heading">Notifications & Reminders</h2>
          <p className="page-subheading">
            Stay up to date with AI scheduling suggestions, task deadlines, and learning alerts.
          </p>
        </div>

        <div className="notif-filter-toggle">
          <button
            className={`filter-btn ${!filterUnreadOnly ? 'active' : ''}`}
            onClick={() => setFilterUnreadOnly(false)}
          >
            All
          </button>
          <button
            className={`filter-btn ${filterUnreadOnly ? 'active' : ''}`}
            onClick={() => setFilterUnreadOnly(true)}
          >
            Unread
          </button>
        </div>
      </div>

      <div className="notif-page-content">
        <NotificationList
          notifications={displayedNotifications}
          loading={loading}
          onMarkRead={markRead}
          onMarkAllRead={markAllRead}
          onDelete={removeNotification}
        />
      </div>
    </div>
  );
}

export default NotificationsPage;
