import { useState, useMemo } from 'react';
import { Plus, CheckSquare, ListFilter } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { TaskList } from '../components/tasks/TaskList';
import { TaskFilter } from '../components/tasks/TaskFilter';
import { TaskForm } from '../components/tasks/TaskForm';
import './TasksPage.css';

export function TasksPage() {
  const { tasks, loading, addTask, updateTask, toggleTask, removeTask } = useTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
  const [selectedTask, setSelectedTask] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title?.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }
      if (statusFilter !== 'ALL' && task.status !== statusFilter) return false;
      if (priorityFilter !== 'ALL' && task.priority !== priorityFilter) return false;
      if (categoryFilter !== 'ALL' && task.category !== categoryFilter) return false;
      return true;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter, categoryFilter]);

  const handleCreateSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await addTask(formData);
      setModalMode(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (formData) => {
    if (!selectedTask) return;
    setSubmitting(true);
    try {
      await updateTask(selectedTask.id, formData);
      setModalMode(null);
      setSelectedTask(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    setSubmitting(true);
    try {
      await removeTask(deleteConfirmId);
      setDeleteConfirmId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length;
  const pendingCount = tasks.filter((t) => t.status !== 'COMPLETED').length;

  return (
    <div className="tasks-page-container">
      <div className="tasks-page-header">
        <div>
          <h2 className="page-heading">Task Management</h2>
          <p className="page-subheading">
            Organize, prioritize, and track all your coding exercises and learning milestones.
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus size={18} />}
          onClick={() => {
            setSelectedTask(null);
            setModalMode('create');
          }}
        >
          Add Task
        </Button>
      </div>

      <div className="tasks-summary-bar">
        <div className="summary-pill pill-all">
          <span>All Tasks:</span>
          <strong>{tasks.length}</strong>
        </div>
        <div className="summary-pill pill-pending">
          <span>Pending:</span>
          <strong>{pendingCount}</strong>
        </div>
        <div className="summary-pill pill-completed">
          <span>Completed:</span>
          <strong>{completedCount}</strong>
        </div>
      </div>

      <TaskFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
      />

      <TaskList
        tasks={filteredTasks}
        loading={loading}
        onToggle={toggleTask}
        onEdit={(task) => {
          setSelectedTask(task);
          setModalMode('edit');
        }}
        onDelete={(id) => setDeleteConfirmId(id)}
        onAddNew={() => setModalMode('create')}
      />

      <Modal
        isOpen={modalMode !== null}
        onClose={() => {
          setModalMode(null);
          setSelectedTask(null);
        }}
        title={modalMode === 'edit' ? 'Edit Learning Task' : 'Create New Learning Task'}
      >
        <TaskForm
          initialData={selectedTask}
          onSubmit={modalMode === 'edit' ? handleEditSubmit : handleCreateSubmit}
          onCancel={() => {
            setModalMode(null);
            setSelectedTask(null);
          }}
          loading={submitting}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message="Are you sure you want to permanently delete this task? This action cannot be undone."
        confirmText="Delete"
        loading={submitting}
      />
    </div>
  );
}

export default TasksPage;
