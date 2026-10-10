export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

export function validatePassword(password) {
  return password && password.length >= 6;
}

export function validateTask(task) {
  const errors = {};
  if (!task.title || !task.title.trim()) {
    errors.title = 'Title is required';
  }
  if (!task.taskDate) {
    errors.taskDate = 'Date is required';
  }
  if (task.estimatedMinutes && (isNaN(task.estimatedMinutes) || task.estimatedMinutes <= 0)) {
    errors.estimatedMinutes = 'Estimated minutes must be positive';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
