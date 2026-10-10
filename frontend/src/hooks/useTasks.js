import { useState, useCallback, useEffect } from 'react';
import taskService from '../services/taskService';
import { useApp } from '../context/AppContext';

export function useTasks(initialDate = null) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { refreshKey, showToast } = useApp();

  const fetchTasks = useCallback(async (date = initialDate, status = null) => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getTasks({ date, status });
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [initialDate]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, refreshKey]);

  const addTask = async (taskData) => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks((prev) => [newTask, ...prev]);
      showToast('Task created successfully!', 'success');
      return newTask;
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create task', 'error');
      throw err;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const updated = await taskService.updateTask(id, taskData);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      showToast('Task updated successfully!', 'success');
      return updated;
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update task', 'error');
      throw err;
    }
  };

  const toggleTask = async (id) => {
    try {
      const updated = await taskService.toggleTaskStatus(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      showToast(
        updated.status === 'COMPLETED' ? 'Task marked complete! Great job!' : 'Task reopened.',
        'info'
      );
      return updated;
    } catch (err) {
      showToast('Failed to update task status', 'error');
      throw err;
    }
  };

  const removeTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      showToast('Task removed', 'info');
    } catch (err) {
      showToast('Failed to delete task', 'error');
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    toggleTask,
    removeTask,
  };
}

export default useTasks;
