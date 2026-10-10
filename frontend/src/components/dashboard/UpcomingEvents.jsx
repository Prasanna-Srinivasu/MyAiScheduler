import { Calendar as CalendarIcon, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDisplayDate, formatMinutes } from '../../utils/dateUtils';
import './UpcomingEvents.css';

export function UpcomingEvents({ tasks = [] }) {
  return (
    <div className="upcoming-events-card">
      <div className="upcoming-events-header">
        <div className="header-title-wrap">
          <CalendarIcon size={18} className="upcoming-icon" />
          <h3 className="section-title">Upcoming Schedule</h3>
        </div>
        <Link to="/calendar" className="view-calendar-link">
          <span>Full Calendar</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="upcoming-empty">
          <p>No upcoming tasks in the next 7 days.</p>
        </div>
      ) : (
        <div className="upcoming-list">
          {tasks.slice(0, 5).map((task) => (
            <div key={task.id} className="upcoming-item">
              <div className="upcoming-date-badge">
                <span className="badge-day">
                  {new Date(task.taskDate).getDate()}
                </span>
                <span className="badge-month">
                  {new Date(task.taskDate).toLocaleString('default', { month: 'short' })}
                </span>
              </div>
              <div className="upcoming-info">
                <span className="upcoming-title">{task.title}</span>
                <div className="upcoming-meta">
                  <span className={`priority-pill pill-${task.priority?.toLowerCase()}`}>
                    {task.priority || 'MED'}
                  </span>
                  {task.estimatedMinutes && (
                    <span className="duration-pill">
                      <Clock size={11} />
                      {formatMinutes(task.estimatedMinutes)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UpcomingEvents;
