import { useState } from 'react';
import CalendarHeader from './CalendarHeader';
import EventCard from './EventCard';
import { formatDate, getTodayDateString } from '../../utils/dateUtils';
import './Calendar.css';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function Calendar({ tasks = [], onSelectDate, onSelectTask }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(getTodayDateString());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const startDayIndex = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonthDays = new Date(year, month, 0).getDate();

  const handlePrev = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNext = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(getTodayDateString());
    onSelectDate && onSelectDate(getTodayDateString());
  };

  const daysGrid = [];

  // Padding days from previous month
  for (let i = startDayIndex - 1; i >= 0; i--) {
    const dayNum = prevMonthDays - i;
    const d = new Date(year, month - 1, dayNum);
    daysGrid.push({
      date: d,
      dateStr: formatDate(d),
      dayNumber: dayNum,
      isCurrentMonth: false,
    });
  }

  // Days in current month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    daysGrid.push({
      date: dateObj,
      dateStr: formatDate(dateObj),
      dayNumber: d,
      isCurrentMonth: true,
    });
  }

  // Padding days for next month to complete the 35 or 42 grid
  const remainingCells = (7 - (daysGrid.length % 7)) % 7;
  for (let d = 1; d <= remainingCells; d++) {
    const dateObj = new Date(year, month + 1, d);
    daysGrid.push({
      date: dateObj,
      dateStr: formatDate(dateObj),
      dayNumber: d,
      isCurrentMonth: false,
    });
  }

  const tasksByDate = tasks.reduce((acc, task) => {
    const key = formatDate(task.taskDate);
    if (!acc[key]) acc[key] = [];
    acc[key].push(task);
    return acc;
  }, {});

  const todayStr = getTodayDateString();

  return (
    <div className="calendar-component">
      <CalendarHeader
        currentMonth={currentDate}
        onPrevMonth={handlePrev}
        onNextMonth={handleNext}
        onToday={handleToday}
      />

      <div className="calendar-weekdays">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="weekday-header">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {daysGrid.map((day, idx) => {
          const dayTasks = tasksByDate[day.dateStr] || [];
          const isToday = day.dateStr === todayStr;
          const isSelected = day.dateStr === selectedDateStr;

          return (
            <div
              key={idx}
              className={`calendar-cell ${!day.isCurrentMonth ? 'other-month' : ''} ${
                isToday ? 'cell-today' : ''
              } ${isSelected ? 'cell-selected' : ''}`}
              onClick={() => {
                setSelectedDateStr(day.dateStr);
                onSelectDate && onSelectDate(day.dateStr);
              }}
            >
              <div className="cell-top">
                <span className={`cell-day-num ${isToday ? 'today-pill' : ''}`}>
                  {day.dayNumber}
                </span>
                {dayTasks.length > 0 && (
                  <span className="cell-task-count">{dayTasks.length}</span>
                )}
              </div>

              <div className="cell-events">
                {dayTasks.slice(0, 3).map((task) => (
                  <EventCard
                    key={task.id}
                    task={task}
                    onClick={() => onSelectTask && onSelectTask(task)}
                  />
                ))}
                {dayTasks.length > 3 && (
                  <span className="more-events-tag">
                    +{dayTasks.length - 3} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;