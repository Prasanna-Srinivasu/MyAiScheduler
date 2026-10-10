import { NotificationItem } from './NotificationItem';
import { Button } from '../common/Button';
import { Loader } from '../common/Loader';
import { Bell, CheckCheck } from 'lucide-react';
import './NotificationList.css';

export function NotificationList({
  notifications = [],
  loading = false,
  onMarkRead,
  onMarkAllRead,
  onDelete,
}) {
  if (loading) {
    return <Loader message="Loading notifications..." />;
  }

  if (notifications.length === 0) {
    return (
      <div className="notif-empty-state">
        <div className="notif-bell-circle">
          <Bell size={32} />
        </div>
        <h4>No Notifications</h4>
        <p>You're all caught up! Updates from AI and study reminders will show here.</p>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="notif-list-container">
      <div className="notif-list-toolbar">
        <span className="notif-count-label">
          {unreadCount > 0 ? `${unreadCount} Unread Notifications` : 'All Caught Up'}
        </span>
        {unreadCount > 0 && onMarkAllRead && (
          <Button
            variant="ghost"
            size="sm"
            icon={<CheckCheck size={16} />}
            onClick={onMarkAllRead}
          >
            Mark all read
          </Button>
        )}
      </div>

      <div className="notif-items-stack">
        {notifications.map((notif) => (
          <NotificationItem
            key={notif.id}
            notification={notif}
            onMarkRead={onMarkRead}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default NotificationList;
