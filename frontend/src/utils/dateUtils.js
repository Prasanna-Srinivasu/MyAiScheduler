export function formatDate(dateInput) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return dateInput;
  return date.toISOString().split('T')[0];
}

export function formatDisplayDate(dateInput) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return dateInput;
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTime(timeInput) {
  if (!timeInput) return '';
  if (typeof timeInput === 'string' && timeInput.length === 5) {
    const [hours, minutes] = timeInput.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  }
  return timeInput;
}

export function formatMinutes(minutes) {
  if (!minutes && minutes !== 0) return '0 min';
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining > 0 ? `${hrs}h ${remaining}m` : `${hrs}h`;
}

export function getTodayDateString() {
  return new Date().toISOString().split('T')[0];
}

export function isSameDay(date1, date2) {
  return formatDate(date1) === formatDate(date2);
}

export function getDaysOfWeek(centerDate = new Date()) {
  const curr = new Date(centerDate);
  const first = curr.getDate() - curr.getDay(); // First day is Sunday (or Monday: + 1)
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(curr.setDate(first + i));
    days.push(new Date(d));
  }
  return days;
}
