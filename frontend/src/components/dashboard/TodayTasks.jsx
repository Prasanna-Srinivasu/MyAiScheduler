import { CheckCircle2, Circle, Clock, Plus, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';
import { formatMinutes } from '../../utils/dateUtils';
import './TodayTasks.css';

export function TodayTasks({ tasks = [], onToggle, onAddNew }) {
  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="today-tasks-section">
      <div className="today-tasks-header">
        <div className="title-progress-wrap">
          <h3 className="section-title">Today's Focus & Action Plan</h3>
          <span className="progress-fraction">
            {completedCount} / {totalCount} Completed
          </span>
        </div>
        <div className="today-tasks-header-actions">
          <Link to="/ai-scheduler">
            <Button variant="outline" size="sm" icon={<Sparkles size={14} />}>
              AI Replan
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={14} />}
            onClick={onAddNew}
          >
            Add Task
          </Button>
        </div>
      </div>

      <div className="progress-bar-container">
        <div
          className="progress-bar-fill"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {tasks.length === 0 ? (
        <div className="today-empty-state">
          <p>No tasks scheduled for today yet.</p>
          <div className="empty-actions">
            <Link to="/ai-scheduler">
              <Button variant="primary" size="sm" icon={<Sparkles size={14} />}>
                Generate AI Day Plan
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="today-tasks-list">
          {tasks.map((task) => {
            const isCompleted = task.status === 'COMPLETED';
            return (
              <div
                key={task.id}
                className={`today-task-row ${isCompleted ? 'is-done' : ''}`}
              >
                <button
                  className="row-toggle-btn"
                  onClick={() => onToggle(task.id)}
                  aria-label="Toggle task status"
                >
                  {isCompleted ? (
                    <CheckCircle2 size={18} className="done-icon" />
                  ) : (
                    <Circle size={18} className="undone-icon" />
                  )}
                </button>
                <div className="row-text">
                  <span className="row-title">{task.title}</span>
                  {task.description && (
                    <span className="row-desc">{task.description}</span>
                  )}
                </div>
                <div className="row-meta">
                  <span className={`priority-tag tag-${task.priority?.toLowerCase()}`}>
                    {task.priority || 'MED'}
                  </span>
                  {task.estimatedMinutes && (
                    <span className="time-tag">
                      <Clock size={12} />
                      {formatMinutes(task.estimatedMinutes)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TodayTasks;
