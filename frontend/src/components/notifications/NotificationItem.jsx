import { Sparkles, Bell, Info, Check, Trash2 } from 'lucide-react';
import './NotificationItem.css';

export function NotificationItem({ notification, onMarkRead, onDelete }) {
  const getCategoryIcon = () => {
    switch (notification.category) {
      case 'AI_INSIGHT':
        return <Sparkles size={16} className="notif-cat-icon icon-ai" />;
      case 'REMINDER':
        return <Bell size={16} className="notif-cat-icon icon-reminder" />;
      default:
        return <Info size={16} className="notif-cat-icon icon-info" />;
    }
  };

  const formattedDate = notification.createdAt
    ? new Date(notification.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <div className={`notification-item-row ${notification.isRead ? 'read' : 'unread'}`}>
      <div className="notif-icon-col">{getCategoryIcon()}</div>

      <div className="notif-main-col">
        <div className="notif-row-header">
          <span className="notif-title">{notification.title}</span>
          <span className="notif-time">{formattedDate}</span>
        </div>
        <p className="notif-message">{notification.message}</p>
      </div>

      <div className="notif-actions-col">
        {!notification.isRead && (
          <button
            className="notif-btn-action read-action"
            onClick={() => onMarkRead(notification.id)}
            title="Mark as Read"
          >
            <Check size={16} />
          </button>
        )}
        <button
          className="notif-btn-action delete-action"
          onClick={() => onDelete(notification.id)}
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default NotificationItem;
