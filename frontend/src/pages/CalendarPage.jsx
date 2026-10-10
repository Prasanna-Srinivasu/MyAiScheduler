import { useState } from 'react';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { Calendar } from '../components/calendar/Calendar';
import { TaskCard } from '../components/tasks/TaskCard';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { TaskForm } from '../components/tasks/TaskForm';
import { formatDisplayDate, getTodayDateString } from '../utils/dateUtils';
import './CalendarPage.css';

export function CalendarPage() {
  const { tasks, loading, addTask, updateTask, toggleTask, removeTask } = useTasks();
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedDateTasks = tasks.filter((t) => t.taskDate === selectedDate);

  const handleTaskSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editingTask) {
        await updateTask(editingTask.id, formData);
      } else {
        await addTask({ ...formData, taskDate: selectedDate });
      }
      setModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="calendar-page-container">
      <div className="calendar-page-header">
        <div>
          <h2 className="page-heading">Monthly Schedule & Calendar</h2>
          <p className="page-subheading">
            View learning milestones, deadlines, and daily task densities across time.
          </p>
        </div>
      </div>

      <div className="calendar-layout-split">
        <div className="calendar-main-column">
          <Calendar
            tasks={tasks}
            onSelectDate={(d) => setSelectedDate(d)}
            onSelectTask={(t) => {
              setSelectedDate(t.taskDate);
              setEditingTask(t);
              setModalOpen(true);
            }}
          />
        </div>

        <div className="calendar-side-panel">
          <div className="panel-header">
            <div>
              <span className="panel-subtitle">Selected Date</span>
              <h3 className="panel-date-title">{formatDisplayDate(selectedDate)}</h3>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={14} />}
              onClick={() => {
                setEditingTask(null);
                setModalOpen(true);
              }}
            >
              Add
            </Button>
          </div>

          <div className="panel-tasks-list">
            {selectedDateTasks.length === 0 ? (
              <div className="panel-empty">
                <p>No tasks scheduled for {formatDisplayDate(selectedDate)}.</p>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Plus size={14} />}
                  onClick={() => {
                    setEditingTask(null);
                    setModalOpen(true);
                  }}
                >
                  Schedule a Task
                </Button>
              </div>
            ) : (
              selectedDateTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onEdit={(t) => {
                    setEditingTask(t);
                    setModalOpen(true);
                  }}
                  onDelete={removeTask}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
        title={editingTask ? 'Edit Task' : `New Task for ${formatDisplayDate(selectedDate)}`}
      >
        <TaskForm
          initialData={editingTask ? editingTask : { taskDate: selectedDate }}
          onSubmit={handleTaskSubmit}
          onCancel={() => {
            setModalOpen(false);
            setEditingTask(null);
          }}
          loading={submitting}
        />
      </Modal>
    </div>
  );
}

export default CalendarPage;
