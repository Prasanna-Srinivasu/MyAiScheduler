import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../common/Button';
import './CalendarHeader.css';

export function CalendarHeader({ currentMonth, onPrevMonth, onNextMonth, onToday }) {
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="calendar-header-bar">
      <h3 className="calendar-month-title">{monthName}</h3>
      <div className="calendar-nav-buttons">
        <Button variant="secondary" size="sm" onClick={onToday}>
          Today
        </Button>
        <button className="nav-arrow-btn" onClick={onPrevMonth} aria-label="Previous Month">
          <ChevronLeft size={18} />
        </button>
        <button className="nav-arrow-btn" onClick={onNextMonth} aria-label="Next Month">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default CalendarHeader;
