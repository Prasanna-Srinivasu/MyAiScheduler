import { Sparkles, CheckCircle2, Clock, Zap, Lightbulb, Quote } from 'lucide-react';
import { formatMinutes, formatDate } from '../../utils/dateUtils';
import './AiSuggestion.css';

export function AiSuggestion({ plan }) {
  if (!plan) return null;

  return (
    <div className="ai-suggestion-box">
      <div className="suggestion-header">
        <div className="badge-row">
          <span className="ai-plan-badge">
            <Sparkles size={14} />
            AI Optimized Routine
          </span>
          <span className={`energy-level-badge energy-${plan.energyLevel?.toLowerCase()}`}>
            <Zap size={12} />
            {plan.energyLevel} Energy
          </span>
        </div>
        <h3 className="plan-title">{plan.summary}</h3>
        <p className="plan-reason">{plan.generatedReason}</p>
      </div>

      <div className="plan-metrics-strip">
        <div className="metric-box">
          <span className="metric-label">Schedule Date</span>
          <span className="metric-val">{formatDate(plan.scheduleDate)}</span>
        </div>
        <div className="metric-box">
          <span className="metric-label">Planned Time</span>
          <span className="metric-val highlight">{formatMinutes(plan.plannedMinutes)}</span>
        </div>
        <div className="metric-box">
          <span className="metric-label">Total Tasks</span>
          <span className="metric-val">{plan.suggestedTasks?.length || 0} Blocks</span>
        </div>
      </div>

      <div className="tasks-timeline-section">
        <h4 className="sub-title">Generated Task Blocks</h4>
        <div className="suggested-tasks-list">
          {plan.suggestedTasks?.map((task, idx) => (
            <div key={idx} className="suggested-task-card">
              <div className="task-step-number">{idx + 1}</div>
              <div className="suggested-task-main">
                <div className="task-top">
                  <span className="task-name">{task.title}</span>
                  <div className="badge-group">
                    <span className={`priority-tag tag-${task.priority?.toLowerCase()}`}>
                      {task.priority}
                    </span>
                    <span className="category-tag">{task.category}</span>
                  </div>
                </div>
                {task.description && (
                  <p className="task-desc">{task.description}</p>
                )}
              </div>
              <div className="task-time-badge">
                <Clock size={13} />
                <span>{formatMinutes(task.estimatedMinutes)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {plan.tips && plan.tips.length > 0 && (
        <div className="ai-tips-card">
          <div className="tips-title-wrap">
            <Lightbulb size={18} className="tips-icon" />
            <h4 className="sub-title">AI Recommendations for this Session</h4>
          </div>
          <ul className="tips-list">
            {plan.tips.map((tip, index) => (
              <li key={index} className="tip-item">
                <CheckCircle2 size={15} className="tip-bullet" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {plan.motivationalQuote && (
        <div className="motivational-card">
          <Quote size={20} className="quote-icon" />
          <p className="quote-text">"{plan.motivationalQuote}"</p>
        </div>
      )}
    </div>
  );
}

export default AiSuggestion;
