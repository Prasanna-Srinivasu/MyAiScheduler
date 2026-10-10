import { CheckCircle2, Circle, Clock, Calendar, Edit2, Trash2 } from 'lucide-react';
import { formatMinutes, formatDate } from '../../utils/dateUtils';
import './TaskCard.css';

export function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const isCompleted = task.status === 'COMPLETED';

  return (
    <div className={`task-card ${isCompleted ? 'task-completed' : ''} priority-${task.priority?.toLowerCase()}`}>
      <button
        className="task-toggle-btn"
        onClick={() => onToggle(task.id)}
        aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {isCompleted ? (
          <CheckCircle2 className="toggle-icon checked" size={22} />
        ) : (
          <Circle className="toggle-icon unchecked" size={22} />
        )}
      </button>

      <div className="task-content">
        <div className="task-header">
          <h4 className="task-title">{task.title}</h4>
          <div className="task-badges">
            <span className={`task-priority-badge badge-${task.priority?.toLowerCase()}`}>
              {task.priority || 'MEDIUM'}
            </span>
            <span className="task-category-badge">
              {task.category || 'STUDY'}
            </span>
          </div>
        </div>

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        <div className="task-meta">
          <span className="meta-item">
            <Calendar size={14} />
            {formatDate(task.taskDate)}
          </span>
          {task.estimatedMinutes && (
            <span className="meta-item">
              <Clock size={14} />
              {formatMinutes(task.estimatedMinutes)}
            </span>
          )}
        </div>
      </div>

      <div className="task-actions">
        {onEdit && (
          <button
            className="action-btn edit-btn"
            onClick={() => onEdit(task)}
            title="Edit Task"
          >
            <Edit2 size={16} />
          </button>
        )}
        {onDelete && (
          <button
            className="action-btn delete-btn"
            onClick={() => onDelete(task.id)}
            title="Delete Task"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export default TaskCard;
