import { useState, useEffect } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { TASK_CATEGORIES, TASK_PRIORITY } from '../../utils/constants';
import { getTodayDateString } from '../../utils/dateUtils';
import { validateTask } from '../../utils/validation';
import './TaskForm.css';

export function TaskForm({ initialData, onSubmit, onCancel, loading = false }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    taskDate: getTodayDateString(),
    estimatedMinutes: 45,
    priority: TASK_PRIORITY.MEDIUM,
    category: 'STUDY',
    status: 'PENDING',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        taskDate: initialData.taskDate || getTodayDateString(),
        estimatedMinutes: initialData.estimatedMinutes || 45,
        priority: initialData.priority || TASK_PRIORITY.MEDIUM,
        category: initialData.category || 'STUDY',
        status: initialData.status || 'PENDING',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'estimatedMinutes' ? Number(value) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateTask(formData);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <Input
        label="Task Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="e.g. Build Spring Security JWT Filter"
        required
        error={errors.title}
      />

      <Input
        label="Description / Learning Objectives"
        name="description"
        as="textarea"
        value={formData.description}
        onChange={handleChange}
        placeholder="What specific concepts or tasks will you accomplish?"
        rows={3}
      />

      <div className="form-row">
        <Input
          label="Schedule Date"
          type="date"
          name="taskDate"
          value={formData.taskDate}
          onChange={handleChange}
          required
          error={errors.taskDate}
        />

        <Input
          label="Duration (Minutes)"
          type="number"
          name="estimatedMinutes"
          value={formData.estimatedMinutes}
          onChange={handleChange}
          placeholder="45"
          min="5"
          step="5"
        />
      </div>

      <div className="form-row">
        <Input
          label="Priority"
          name="priority"
          as="select"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="HIGH">High Priority</option>
          <option value="MEDIUM">Medium Priority</option>
          <option value="LOW">Low Priority</option>
        </Input>

        <Input
          label="Category"
          name="category"
          as="select"
          value={formData.category}
          onChange={handleChange}
        >
          {TASK_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Input>
      </div>

      <div className="task-form-actions">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" loading={loading}>
          {initialData ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}

export default TaskForm;
