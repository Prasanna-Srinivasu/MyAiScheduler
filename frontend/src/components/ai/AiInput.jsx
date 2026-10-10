import { useState } from 'react';
import { Sparkles, Zap, BatteryMedium, BatteryLow, Clock, Target } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { TARGET_ROLES, EXPERIENCE_LEVELS } from '../../utils/constants';
import { getTodayDateString } from '../../utils/dateUtils';
import './AiInput.css';

export function AiInput({ onGenerate, loading = false, userRole, userLevel }) {
  const [scheduleDate, setScheduleDate] = useState(getTodayDateString());
  const [availableHours, setAvailableHours] = useState(4);
  const [energyLevel, setEnergyLevel] = useState('HIGH');
  const [targetRole, setTargetRole] = useState(userRole || TARGET_ROLES[0]);
  const [experienceLevel, setExperienceLevel] = useState(userLevel || 'Intermediate');
  const [userPrompt, setUserPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate({
      scheduleDate,
      availableHours: Number(availableHours),
      energyLevel,
      targetRole,
      experienceLevel,
      userPrompt: userPrompt.trim(),
      autoSaveTasks: true,
    });
  };

  return (
    <form className="ai-schedule-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <div className="heading-sparkle">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="form-title">AI Schedule Generator</h3>
          <p className="form-subtitle">
            Provide your daily parameters and let AI build an optimized study & coding routine.
          </p>
        </div>
      </div>

      <div className="ai-grid-row">
        <Input
          label="Schedule Date"
          type="date"
          value={scheduleDate}
          onChange={(e) => setScheduleDate(e.target.value)}
          required
        />

        <div className="hours-slider-group">
          <div className="hours-label-row">
            <label className="input-label">Available Study Hours</label>
            <span className="hours-badge">
              <Clock size={12} />
              {availableHours} Hours ({availableHours * 60} mins)
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={availableHours}
            onChange={(e) => setAvailableHours(Number(e.target.value))}
            className="hours-slider"
          />
          <div className="hours-ticks">
            <span>1h</span>
            <span>4h</span>
            <span>7h</span>
            <span>10h</span>
          </div>
        </div>
      </div>

      <div className="energy-selector-group">
        <label className="input-label">Today's Energy Level</label>
        <div className="energy-options">
          <button
            type="button"
            className={`energy-card ${energyLevel === 'HIGH' ? 'selected energy-high' : ''}`}
            onClick={() => setEnergyLevel('HIGH')}
          >
            <Zap size={20} className="energy-icon" />
            <div className="energy-text">
              <span className="energy-name">High Energy</span>
              <span className="energy-desc">Heavy coding, algorithms & challenging builds</span>
            </div>
          </button>

          <button
            type="button"
            className={`energy-card ${energyLevel === 'MEDIUM' ? 'selected energy-medium' : ''}`}
            onClick={() => setEnergyLevel('MEDIUM')}
          >
            <BatteryMedium size={20} className="energy-icon" />
            <div className="energy-text">
              <span className="energy-name">Moderate Energy</span>
              <span className="energy-desc">Feature development, balanced study & practice</span>
            </div>
          </button>

          <button
            type="button"
            className={`energy-card ${energyLevel === 'LOW' ? 'selected energy-low' : ''}`}
            onClick={() => setEnergyLevel('LOW')}
          >
            <BatteryLow size={20} className="energy-icon" />
            <div className="energy-text">
              <span className="energy-name">Low Energy</span>
              <span className="energy-desc">Passive review, documentation, flashcards & notes</span>
            </div>
          </button>
        </div>
      </div>

      <div className="ai-grid-row">
        <Input
          label="Target Role"
          as="select"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
        >
          {TARGET_ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </Input>

        <Input
          label="Experience Level"
          as="select"
          value={experienceLevel}
          onChange={(e) => setExperienceLevel(e.target.value)}
        >
          {EXPERIENCE_LEVELS.map((lvl) => (
            <option key={lvl} value={lvl}>
              {lvl}
            </option>
          ))}
        </Input>
      </div>

      <Input
        label="Custom Goal / Focus Objective (Optional)"
        name="userPrompt"
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
        placeholder="e.g. Prepare for System Design & Spring Security, or finish Redux Toolkit module"
        helperText="AI will prioritize this specific milestone in the generated routine."
      />

      <div className="form-submit-row">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          icon={<Sparkles size={18} />}
          loading={loading}
          className="generate-submit-btn"
        >
          Generate Optimized Schedule
        </Button>
      </div>
    </form>
  );
}

export default AiInput;
