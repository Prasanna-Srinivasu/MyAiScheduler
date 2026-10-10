import { Clock } from 'lucide-react';
import { formatMinutes } from '../../utils/dateUtils';
import './EventCard.css';

export function EventCard({ task, onClick }) {
  const isDone = task.status === 'COMPLETED';

  return (
    <div
      className={`calendar-event-pill priority-${task.priority?.toLowerCase()} ${isDone ? 'event-done' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick(task);
      }}
      title={`${task.title} (${task.estimatedMinutes || 45} mins)`}
    >
      <span className="event-dot"></span>
      <span className="event-pill-title">{task.title}</span>
      {task.estimatedMinutes && (
        <span className="event-pill-time">
          {task.estimatedMinutes}m
        </span>
      )}
    </div>
  );
}

export default EventCard;
