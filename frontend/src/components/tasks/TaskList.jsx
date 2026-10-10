import TaskCard from './TaskCard';
import { Loader } from '../common/Loader';
import { Button } from '../common/Button';
import { CheckSquare, Plus } from 'lucide-react';
import './TaskList.css';

export function TaskList({
  tasks = [],
  loading = false,
  onToggle,
  onEdit,
  onDelete,
  onAddNew,
  emptyMessage = 'No tasks found.',
}) {
  if (loading) {
    return <Loader message="Loading tasks..." />;
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <div className="empty-icon-wrap">
          <CheckSquare size={36} />
        </div>
        <h4 className="empty-title">All Caught Up!</h4>
        <p className="empty-desc">{emptyMessage}</p>
        {onAddNew && (
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={16} />}
            onClick={onAddNew}
          >
            Create New Task
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="task-list-items">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default TaskList;
