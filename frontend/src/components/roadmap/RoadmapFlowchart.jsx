import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowDown,
  ArrowRight,
  BookOpen,
  Award,
  Flame,
  Check,
  ChevronRight,
  Code2,
  ListOrdered,
  ExternalLink,
} from 'lucide-react';
import { ROADMAPS } from './roadmapData';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { useSchedule } from '../../hooks/useSchedule';
import { useApp } from '../../context/AppContext';
import './RoadmapFlowchart.css';

export function RoadmapFlowchart({ onSelectTopicForScheduler }) {
  const [activeTrack, setActiveTrack] = useState('java'); // 'java' | 'frontend' | 'fullstack'
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [scheduleDuration, setScheduleDuration] = useState(2);
  const [scheduleEnergy, setScheduleEnergy] = useState('MEDIUM');
  const [generatingForTopic, setGeneratingForTopic] = useState(false);

  // Stored progress for each roadmap track: trackId -> { completedIds: [], focusId: '' }
  const [roadmapProgress, setRoadmapProgress] = useState(() => {
    const saved = localStorage.getItem('study_roadmap_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      java: { completedIds: ['java-1', 'java-2'], focusId: 'java-3' },
      frontend: { completedIds: ['fe-1', 'fe-2'], focusId: 'fe-3' },
      fullstack: { completedIds: ['fs-1', 'fs-2'], focusId: 'fs-3' },
    };
  });

  const { generateWithAi } = useSchedule();
  const { showToast, triggerRefresh } = useApp();
  const navigate = useNavigate();

  const currentRoadmap = ROADMAPS[activeTrack] || ROADMAPS.java;
  const currentTrackProgress = roadmapProgress[activeTrack] || {
    completedIds: [],
    focusId: currentRoadmap.nodes[0]?.id,
  };

  useEffect(() => {
    localStorage.setItem('study_roadmap_progress', JSON.stringify(roadmapProgress));
  }, [roadmapProgress]);

  const toggleTopicCompleted = (topicId) => {
    setRoadmapProgress((prev) => {
      const trackState = prev[activeTrack] || { completedIds: [], focusId: '' };
      const isCompleted = trackState.completedIds.includes(topicId);
      const newCompleted = isCompleted
        ? trackState.completedIds.filter((id) => id !== topicId)
        : [...trackState.completedIds, topicId];

      // Auto advance focus to next incomplete node
      let nextFocus = trackState.focusId;
      if (!isCompleted) {
        const nextNode = currentRoadmap.nodes.find(
          (n) => !newCompleted.includes(n.id)
        );
        if (nextNode) nextFocus = nextNode.id;
      }

      return {
        ...prev,
        [activeTrack]: {
          ...trackState,
          completedIds: newCompleted,
          focusId: nextFocus,
        },
      };
    });
  };

  const setAsFocusTopic = (topicId) => {
    setRoadmapProgress((prev) => ({
      ...prev,
      [activeTrack]: {
        ...(prev[activeTrack] || { completedIds: [] }),
        focusId: topicId,
      },
    }));
    showToast(`Set "${currentRoadmap.nodes.find((n) => n.id === topicId)?.title}" as your active study focus!`, 'info');
  };

  const completedCount = currentTrackProgress.completedIds.length;
  const totalCount = currentRoadmap.nodes.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const handleGenerateScheduleForTopic = async (topic) => {
    setGeneratingForTopic(true);
    try {
      if (onSelectTopicForScheduler) {
        // Callback to pre-fill parent AI Scheduler generator
        onSelectTopicForScheduler({
          prompt: topic.aiSchedulePrompt,
          focusAreas: topic.concepts.slice(0, 3),
          hours: scheduleDuration,
          energy: scheduleEnergy,
        });
        setSelectedTopic(null);
        showToast(`Loaded ${topic.title} into the AI Scheduler generator.`, 'success');
      } else {
        // Direct generation and save
        await generateWithAi({
          userPrompt: topic.aiSchedulePrompt,
          focusAreas: topic.concepts.slice(0, 3),
          availableHours: scheduleDuration,
          energyLevel: scheduleEnergy,
          autoSaveTasks: true,
        });
        showToast(`AI generated and saved today's study tasks for ${topic.title}!`, 'success');
        setSelectedTopic(null);
        triggerRefresh();
        navigate('/tasks');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to generate schedule for topic', 'error');
    } finally {
      setGeneratingForTopic(false);
    }
  };

  return (
    <div className="roadmap-flowchart-container">
      {/* Top Controls & Track Switcher */}
      <div className="roadmap-header">
        <div className="track-switcher">
          <button
            className={`track-tab-btn ${activeTrack === 'java' ? 'active' : ''}`}
            onClick={() => setActiveTrack('java')}
          >
            <span className="track-icon">☕</span>
            <div className="track-btn-text">
              <span className="track-title">Java Backend</span>
              <span className="track-sub">10 Steps • Core to Spring Boot</span>
            </div>
          </button>

          <button
            className={`track-tab-btn ${activeTrack === 'frontend' ? 'active' : ''}`}
            onClick={() => setActiveTrack('frontend')}
          >
            <span className="track-icon">⚛️</span>
            <div className="track-btn-text">
              <span className="track-title">Frontend React</span>
              <span className="track-sub">10 Steps • HTML to React 19</span>
            </div>
          </button>

          <button
            className={`track-tab-btn ${activeTrack === 'fullstack' ? 'active' : ''}`}
            onClick={() => setActiveTrack('fullstack')}
          >
            <span className="track-icon">🚀</span>
            <div className="track-btn-text">
              <span className="track-title">Full Stack Master</span>
              <span className="track-sub">8 Steps • Java + React E2E</span>
            </div>
          </button>
        </div>

        {/* Progress & Stats Strip */}
        <div className="roadmap-stats-strip">
          <div className="stats-left">
            <h3 className="current-track-heading">
              {currentRoadmap.icon} {currentRoadmap.title}
            </h3>
            <p className="current-track-tagline">{currentRoadmap.tagline}</p>
          </div>

          <div className="stats-right">
            <div className="progress-label-row">
              <span className="progress-text">
                Progress: <strong>{completedCount} of {totalCount} Topics</strong> ({progressPercent}%)
              </span>
              <span className="hours-pill">
                <Clock size={12} />
                ~{currentRoadmap.totalHours} Study Hours
              </span>
            </div>
            <div className="roadmap-progress-bar-bg">
              <div
                className="roadmap-progress-bar-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Visual Flowchart Canvas */}
      <div className="flowchart-tree">
        <div className="flowchart-path-notice">
          <Flame size={16} className="flame-icon" />
          <span>
            Follow the pedagogical flowchart below: complete topics in order (
            <strong>Step 1 ➔ Step 2 ➔ Step 3...</strong>). Click any topic to inspect concepts and schedule daily AI tasks!
          </span>
        </div>

        <div className="flowchart-nodes-list">
          {currentRoadmap.nodes.map((node, index) => {
            const isCompleted = currentTrackProgress.completedIds.includes(node.id);
            const isCurrentFocus = currentTrackProgress.focusId === node.id;
            const isNext = !isCompleted && !isCurrentFocus && index === currentTrackProgress.completedIds.length;

            let statusClass = 'locked';
            let statusLabel = 'Upcoming';
            if (isCompleted) {
              statusClass = 'completed';
              statusLabel = 'Completed ✓';
            } else if (isCurrentFocus) {
              statusClass = 'current-focus';
              statusLabel = 'Current Focus ⚡';
            } else if (isNext) {
              statusClass = 'next-up';
              statusLabel = 'Next Up';
            }

            return (
              <div key={node.id} className="flowchart-node-wrapper">
                {/* Visual Step Card */}
                <div className={`flowchart-card ${statusClass}`}>
                  <div className="card-top-strip">
                    <span className="step-tag">STEP {node.step < 10 ? `0${node.step}` : node.step}</span>
                    <span className={`status-badge ${statusClass}`}>{statusLabel}</span>
                  </div>

                  <div className="card-main-content">
                    <div className="card-header-row">
                      <h4 className="node-title">{node.title}</h4>
                      <span className="node-category">{node.category}</span>
                    </div>

                    <p className="node-description">{node.shortDesc}</p>

                    <div className="node-concepts-preview">
                      {node.concepts.slice(0, 3).map((concept, i) => (
                        <span key={i} className="concept-pill">
                          {concept}
                        </span>
                      ))}
                      {node.concepts.length > 3 && (
                        <span className="concept-pill more-pill">
                          +{node.concepts.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="card-bottom-actions">
                    <div className="duration-meta">
                      <Clock size={14} />
                      <span>~{node.estimatedHours} hrs</span>
                    </div>

                    <div className="action-buttons-group">
                      <button
                        type="button"
                        className="btn-mark-status"
                        onClick={() => toggleTopicCompleted(node.id)}
                        title={isCompleted ? 'Mark Incomplete' : 'Mark Completed'}
                      >
                        {isCompleted ? <Check size={16} /> : <CheckCircle2 size={16} />}
                        <span>{isCompleted ? 'Done' : 'Mark Done'}</span>
                      </button>

                      {!isCompleted && !isCurrentFocus && (
                        <button
                          type="button"
                          className="btn-set-focus"
                          onClick={() => setAsFocusTopic(node.id)}
                          title="Set as your active study target"
                        >
                          Focus Here
                        </button>
                      )}

                      <button
                        type="button"
                        className="btn-view-details"
                        onClick={() => setSelectedTopic(node)}
                      >
                        View Syllabus
                      </button>

                      <button
                        type="button"
                        className="btn-quick-ai"
                        onClick={() => {
                          setSelectedTopic(node);
                        }}
                        title="Generate study tasks for this topic"
                      >
                        <Sparkles size={14} />
                        <span>Schedule with AI</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Flowchart Connector Arrow */}
                {index < currentRoadmap.nodes.length - 1 && (
                  <div className="flowchart-connector">
                    <div className="connector-line" />
                    <div className="connector-arrow">
                      <ArrowDown size={18} />
                    </div>
                    <span className="connector-label">next topic</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Topic Detail & AI Scheduling Modal */}
      {selectedTopic && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedTopic(null)}
          title={`Step ${selectedTopic.step}: ${selectedTopic.title}`}
          maxWidth="640px"
        >
          <div className="topic-modal-content">
            <div className="topic-modal-header-meta">
              <span className="topic-category-pill">{selectedTopic.category}</span>
              <span className="topic-hours-pill">
                <Clock size={14} /> {selectedTopic.estimatedHours} Study Hours
              </span>
              <span className="topic-level-pill">{selectedTopic.difficulty}</span>
            </div>

            <p className="topic-modal-desc">{selectedTopic.shortDesc}</p>

            {/* Concepts Checklist */}
            <div className="topic-modal-section">
              <h4 className="section-title">
                <BookOpen size={16} /> Core Concepts &amp; Syllabus
              </h4>
              <ul className="concepts-checklist">
                {selectedTopic.concepts.map((concept, i) => (
                  <li key={i} className="concept-check-item">
                    <span className="check-bullet">▹</span>
                    <span>{concept}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CodeCamp Hands-on Challenge */}
            <div className="topic-modal-section challenge-box">
              <h4 className="section-title">
                <Code2 size={16} /> CodeCamp Hands-on Challenge
              </h4>
              <p className="challenge-desc">{selectedTopic.challenge}</p>
            </div>

            {/* AI Scheduling Box */}
            <div className="topic-modal-section ai-scheduler-box">
              <div className="ai-box-header">
                <Sparkles size={18} className="ai-sparkle-icon" />
                <div>
                  <h4 className="ai-box-title">Generate AI Daily Study Plan for this Topic</h4>
                  <p className="ai-box-sub">
                    AI will break down "{selectedTopic.title}" into timed coding and revision blocks.
                  </p>
                </div>
              </div>

              <div className="ai-schedule-params-row">
                <div className="param-group">
                  <label>Available Hours Today:</label>
                  <select
                    value={scheduleDuration}
                    onChange={(e) => setScheduleDuration(Number(e.target.value))}
                    className="param-select"
                  >
                    <option value={1}>1 Hour (Fast Sprint)</option>
                    <option value={2}>2 Hours (Standard)</option>
                    <option value={3}>3 Hours (Deep Focus)</option>
                    <option value={4}>4 Hours (Intensive)</option>
                  </select>
                </div>

                <div className="param-group">
                  <label>Focus Energy:</label>
                  <select
                    value={scheduleEnergy}
                    onChange={(e) => setScheduleEnergy(e.target.value)}
                    className="param-select"
                  >
                    <option value="HIGH">High (Deep Coding)</option>
                    <option value="MEDIUM">Medium (Balanced)</option>
                    <option value="LOW">Low (Review &amp; Notes)</option>
                  </select>
                </div>
              </div>

              <div className="ai-box-actions">
                <Button
                  variant="primary"
                  size="md"
                  icon={<Sparkles size={16} />}
                  onClick={() => handleGenerateScheduleForTopic(selectedTopic)}
                  loading={generatingForTopic}
                >
                  Generate &amp; Add Tasks to My Schedule
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default RoadmapFlowchart;
