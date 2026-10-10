import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Compass,
  Search,
  BookOpen,
  Sparkles,
  Bot,
  Send,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Layers,
  Code2,
  Award,
  ChevronRight,
  ChevronDown,
  Check,
  HelpCircle,
  Calendar,
  X,
  Flame,
  RotateCcw
} from 'lucide-react';
import { ROADMAP_CATALOG, getRoadmapById } from '../components/roadmap/roadmapData';
import aiService from '../services/aiService';
import { useAuth } from '../hooks/useAuth';
import './RoadmapChatPage.css';

export function RoadmapChatPage() {
  const { trackId: paramTrackId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Active track state (default to full-stack if param provided, or null for catalog view)
  const [activeTrackId, setActiveTrackId] = useState(paramTrackId || 'full-stack');
  const [activeRoadmap, setActiveRoadmap] = useState(() => getRoadmapById(paramTrackId || 'full-stack'));
  const [viewMode, setViewMode] = useState(paramTrackId ? 'studio' : 'catalog'); // 'catalog' | 'studio'

  // Search & Filter state for catalog
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCatalogTab, setActiveCatalogTab] = useState('ALL'); // 'ALL' | 'Role-based' | 'Skill-based'

  // Active selected topic node inside roadmap
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeCompletion, setNodeCompletion] = useState({});

  // AI Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizSelectedOption, setQuizSelectedOption] = useState(null);
  const [scheduleSuccessMsg, setScheduleSuccessMsg] = useState('');

  // Mobile drawer toggle
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Sync when paramTrackId changes
  useEffect(() => {
    if (paramTrackId) {
      setActiveTrackId(paramTrackId);
      const rm = getRoadmapById(paramTrackId);
      setActiveRoadmap(rm);
      setSelectedNode(rm.nodes[0] || null);
      setViewMode('studio');
      initChatForTopic(rm.nodes[0]?.title || rm.title, rm.title);
    }
  }, [paramTrackId]);

  useEffect(() => {
    if (activeRoadmap && activeRoadmap.nodes?.length > 0 && !selectedNode) {
      setSelectedNode(activeRoadmap.nodes[0]);
      initChatForTopic(activeRoadmap.nodes[0].title, activeRoadmap.title);
    }
  }, [activeRoadmap]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeQuiz]);

  const initChatForTopic = (topicTitle, roadmapTitle) => {
    setChatMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: `### 🤖 AI Tutor for ${roadmapTitle}\n\nWelcome! I'm your dedicated AI Mentor for **${roadmapTitle}**. I'm currently focused on **${topicTitle}**.\n\nYou can ask me anything about this concept, generate interactive quizzes, or request real-world coding challenges!`,
        suggestions: [
          `Explain ${topicTitle} simply`,
          `Hands-on challenge for ${topicTitle}`,
          `Top interview Q&A for ${topicTitle}`,
          `Quiz me on ${topicTitle}`,
        ],
      },
    ]);
    setActiveQuiz(null);
    setQuizSelectedOption(null);
  };

  const handleSelectTrack = (trackId) => {
    setActiveTrackId(trackId);
    const rm = getRoadmapById(trackId);
    setActiveRoadmap(rm);
    setSelectedNode(rm.nodes[0] || null);
    setViewMode('studio');
    initChatForTopic(rm.nodes[0]?.title || rm.title, rm.title);
  };

  const handleSelectNode = (node) => {
    setSelectedNode(node);
    setActiveQuiz(null);
    setQuizSelectedOption(null);

    // Add note in chat about switching context
    setChatMessages((prev) => [
      ...prev,
      {
        id: `switch-${Date.now()}`,
        sender: 'ai',
        text: `Switched focus to **${node.title}** (${node.category}). How would you like to explore this topic?`,
        suggestions: [
          `Explain ${node.title}`,
          `Hands-on challenge`,
          `Interview questions`,
          `Quiz me on this`,
          `Add to AI Schedule`,
        ],
      },
    ]);
  };

  const toggleNodeDone = (nodeId, e) => {
    e.stopPropagation();
    setNodeCompletion((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const handleSendMessage = async (textToSend, actionType = 'GENERAL') => {
    const text = textToSend || inputMessage;
    if (!text.trim() && !actionType) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim() || `${actionType} on ${selectedNode?.title || activeRoadmap.title}`,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setAiLoading(true);

    try {
      const response = await aiService.roadmapChat({
        message: text.trim(),
        topic: selectedNode?.title || activeRoadmap.title,
        track: activeTrackId,
        action: actionType,
        difficulty: selectedNode?.difficulty || 'Intermediate',
      });

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.reply,
        suggestions: response.suggestions,
      };

      setChatMessages((prev) => [...prev, aiMsg]);

      // If response contained an interactive quiz
      if (response.quizQuestion && response.quizOptions?.length > 0) {
        setActiveQuiz({
          question: response.quizQuestion,
          options: response.quizOptions,
          correctIndex: response.correctOptionIndex,
          explanation: response.quizExplanation,
        });
        setQuizSelectedOption(null);
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: `I ran into an issue connecting to the AI Tutor service. Here is a quick overview of **${selectedNode?.title || 'this topic'}**:\n\n* **Core Concepts:** ${selectedNode?.concepts?.join(', ') || 'Foundational principles and architecture.'}\n* **Hands-on Task:** ${selectedNode?.challenge || 'Build a small sample component to test your knowledge.'}`,
          suggestions: ['Try another question', 'Explain in simple terms'],
        },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleActionPrompt = (actionType) => {
    if (actionType === 'SCHEDULE') {
      handleScheduleTopic();
      return;
    }
    const topic = selectedNode?.title || activeRoadmap.title;
    let label = '';
    switch (actionType) {
      case 'EXPLAIN':
        label = `Explain ${topic} in simple terms with code examples`;
        break;
      case 'CHALLENGE':
        label = `Give me a hands-on coding challenge for ${topic}`;
        break;
      case 'INTERVIEW':
        label = `What are the top interview questions asked on ${topic}?`;
        break;
      case 'QUIZ':
        label = `Quiz me on ${topic}`;
        break;
      case 'NEXT_STEPS':
        label = `What should I learn after ${topic}?`;
        break;
      default:
        label = `Help me master ${topic}`;
    }
    handleSendMessage(label, actionType);
  };

  const handleScheduleTopic = async () => {
    const topic = selectedNode?.title || activeRoadmap.title;
    try {
      await aiService.generateSchedule({
        focusAreas: [topic],
        hoursPerDay: 3,
        energyLevel: 'MEDIUM',
      });
      setScheduleSuccessMsg(`Scheduled "${topic}" in your study calendar!`);
      setTimeout(() => setScheduleSuccessMsg(''), 4000);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `sched-${Date.now()}`,
          sender: 'ai',
          text: `✅ **Successfully Scheduled!**\n\nI have created a focused 3-hour study block for **${topic}** in your AI Scheduler. Check your **Calendar** or **Tasks** to see today's allocated slots.`,
          suggestions: ['Show next topic', 'Quiz me now'],
        },
      ]);
    } catch {
      setScheduleSuccessMsg(`Scheduled "${topic}" to study queue.`);
      setTimeout(() => setScheduleSuccessMsg(''), 3000);
    }
  };

  const handleSelectQuizOption = (index) => {
    if (quizSelectedOption !== null) return; // already answered
    setQuizSelectedOption(index);
  };

  // Filter catalog roadmaps
  const filteredCatalog = ROADMAP_CATALOG.filter((item) => {
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      activeCatalogTab === 'ALL' || item.category === activeCatalogTab;

    return matchesSearch && matchesCategory;
  });

  const roleRoadmaps = filteredCatalog.filter((r) => r.category === 'Role-based');
  const skillRoadmaps = filteredCatalog.filter((r) => r.category === 'Skill-based');

  // Stats for active roadmap
  const totalNodesCount = activeRoadmap.nodes?.length || 0;
  const completedNodesCount = Object.values(nodeCompletion).filter(Boolean).length;
  const progressPct = totalNodesCount > 0 ? Math.round((completedNodesCount / totalNodesCount) * 100) : 0;

  return (
    <div className="roadmap-chat-wrapper">
      {/* View Mode 1: Catalog Directory (Like https://roadmap.sh/ai/roadmap-chat) */}
      {viewMode === 'catalog' && (
        <div className="roadmap-catalog-container">
          <div className="catalog-header">
            <div className="catalog-badge">
              <Bot size={18} />
              <span>Roadmap AI Mentor Directory</span>
            </div>
            <h1>Chat with a Roadmap</h1>
            <p>
              Select any role-based or skill-based roadmap below and start learning with your dedicated AI Tutor.
            </p>

            {/* Search Input */}
            <div className="catalog-search-wrapper">
              <Search size={18} className="catalog-search-icon" />
              <input
                type="text"
                placeholder="Search roadmaps (e.g. Full Stack, Java, React, Spring Boot, DevOps, DSA)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="catalog-clear-btn"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="catalog-tabs-bar">
              <button
                type="button"
                className={`catalog-tab-btn ${activeCatalogTab === 'ALL' ? 'active' : ''}`}
                onClick={() => setActiveCatalogTab('ALL')}
              >
                All Roadmaps ({ROADMAP_CATALOG.length})
              </button>
              <button
                type="button"
                className={`catalog-tab-btn ${activeCatalogTab === 'Role-based' ? 'active' : ''}`}
                onClick={() => setActiveCatalogTab('Role-based')}
              >
                Role-based Roadmaps
              </button>
              <button
                type="button"
                className={`catalog-tab-btn ${activeCatalogTab === 'Skill-based' ? 'active' : ''}`}
                onClick={() => setActiveCatalogTab('Skill-based')}
              >
                Skill-based Roadmaps
              </button>
            </div>
          </div>

          {/* Role-based Section */}
          {(activeCatalogTab === 'ALL' || activeCatalogTab === 'Role-based') && (
            <div className="catalog-section">
              <h2 className="catalog-section-title">Role-based Roadmaps</h2>
              <div className="catalog-grid">
                {roleRoadmaps.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="roadmap-card-btn"
                    onClick={() => handleSelectTrack(item.id)}
                  >
                    <div className="card-top-row">
                      <span className="card-icon">{item.icon}</span>
                      {item.badge && <span className="card-badge">{item.badge}</span>}
                    </div>
                    <h3 className="card-title">{item.title}</h3>
                    <div className="card-tags">
                      {item.tags?.map((t) => (
                        <span key={t} className="card-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="card-footer-row">
                      <span className="card-hours">
                        <Clock size={12} /> {item.totalHours} hrs
                      </span>
                      <span className="card-chat-cta">
                        Chat with AI <ChevronRight size={14} />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Skill-based Section */}
          {(activeCatalogTab === 'ALL' || activeCatalogTab === 'Skill-based') && (
            <div className="catalog-section">
              <h2 className="catalog-section-title">Skill-based Roadmaps</h2>
              <div className="catalog-grid">
                {skillRoadmaps.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="roadmap-card-btn"
                    onClick={() => handleSelectTrack(item.id)}
                  >
                    <div className="card-top-row">
                      <span className="card-icon">{item.icon}</span>
                      {item.badge && <span className="card-badge">{item.badge}</span>}
                    </div>
                    <h3 className="card-title">{item.title}</h3>
                    <div className="card-tags">
                      {item.tags?.map((t) => (
                        <span key={t} className="card-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="card-footer-row">
                      <span className="card-hours">
                        <Clock size={12} /> {item.totalHours} hrs
                      </span>
                      <span className="card-chat-cta">
                        Chat with AI <ChevronRight size={14} />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* View Mode 2: Studio Split-Screen (Like https://roadmap.sh/ai/roadmap-chat/full-stack) */}
      {viewMode === 'studio' && (
        <div className="roadmap-studio-container">
          {/* Top Sub-Navbar */}
          <div className="studio-topbar">
            <div className="studio-topbar-left">
              <button
                type="button"
                className="back-to-catalog-btn"
                onClick={() => setViewMode('catalog')}
              >
                <ArrowLeft size={16} />
                <span>All Roadmaps</span>
              </button>

              <div className="active-track-pill">
                <span className="track-icon-lg">{activeRoadmap.icon}</span>
                <span className="track-name-lg">{activeRoadmap.title}</span>
              </div>

              {/* Quick Switch Dropdown */}
              <div className="quick-switch-dropdown">
                <select
                  value={activeTrackId}
                  onChange={(e) => handleSelectTrack(e.target.value)}
                >
                  <option disabled value="">
                    Switch Roadmap...
                  </option>
                  {ROADMAP_CATALOG.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.icon} {r.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="studio-topbar-right">
              <div className="progress-pill">
                <span>
                  {completedNodesCount} / {totalNodesCount} completed
                </span>
                <div className="progress-mini-bar">
                  <div
                    className="progress-mini-fill"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              <button
                type="button"
                className="schedule-track-btn"
                onClick={handleScheduleTopic}
              >
                <Sparkles size={14} />
                <span>AI Schedule</span>
              </button>
            </div>
          </div>

          {scheduleSuccessMsg && (
            <div className="studio-notification-bar">
              <Sparkles size={15} />
              <span>{scheduleSuccessMsg}</span>
            </div>
          )}

          {/* Split Screen Workspace */}
          <div className="studio-workspace">
            {/* Left Column: Visual Roadmap Canvas */}
            <div className="studio-flowchart-canvas">
              <div className="canvas-header">
                <div>
                  <h2>{activeRoadmap.pageTitle || activeRoadmap.title}</h2>
                  <p>{activeRoadmap.description || activeRoadmap.tagline}</p>
                </div>
                <div className="canvas-badge-chip">
                  <span>Click any step to chat with AI</span>
                </div>
              </div>

              {/* Nodes Stack */}
              <div className="flowchart-nodes-flow">
                {activeRoadmap.nodes?.map((node, index) => {
                  const isSelected = selectedNode?.id === node.id;
                  const isDone = nodeCompletion[node.id];

                  return (
                    <div key={node.id} className="flow-step-block">
                      {/* Node Card */}
                      <div
                        className={`flow-node-card ${isSelected ? 'is-selected' : ''} ${isDone ? 'is-done' : ''} ${node.isCheckpoint ? 'is-checkpoint' : ''}`}
                        onClick={() => handleSelectNode(node)}
                      >
                        <div className="node-card-left">
                          <button
                            type="button"
                            className={`completion-checkbox ${isDone ? 'checked' : ''}`}
                            onClick={(e) => toggleNodeDone(node.id, e)}
                            title={isDone ? 'Mark as to learn' : 'Mark as done'}
                          >
                            {isDone ? <Check size={14} /> : null}
                          </button>
                        </div>

                        <div className="node-card-body">
                          <div className="node-meta-line">
                            <span className="node-step-tag">Step {node.step}</span>
                            <span className="node-category-tag">{node.category}</span>
                            <span className={`node-diff-tag ${node.difficulty?.toLowerCase().replace(/\s+/g, '-')}`}>
                              {node.difficulty}
                            </span>
                            <span className="node-hours-tag">
                              <Clock size={11} /> {node.estimatedHours}h
                            </span>
                          </div>

                          <h3 className="node-title">{node.title}</h3>
                          <p className="node-short-desc">{node.shortDesc}</p>

                          {/* Expanded concepts on selected node */}
                          {isSelected && node.concepts?.length > 0 && (
                            <div className="node-expanded-concepts">
                              <strong>Key Topics to Master:</strong>
                              <ul>
                                {node.concepts.map((c, i) => (
                                  <li key={i}>{c}</li>
                                ))}
                              </ul>
                              {node.challenge && (
                                <div className="node-challenge-box">
                                  <strong>Challenge:</strong> {node.challenge}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="node-card-right">
                          <button
                            type="button"
                            className="node-chat-trigger"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectNode(node);
                              if (window.innerWidth <= 1024) setMobileChatOpen(true);
                            }}
                          >
                            <Bot size={16} />
                            <span>Ask AI</span>
                          </button>
                        </div>
                      </div>

                      {/* Connector Line if not last */}
                      {index < activeRoadmap.nodes.length - 1 && (
                        <div className="flow-connector-line">
                          <div className="line-bar" />
                          <div className="line-dot" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: AI Tutor & Roadmap Chat Pane */}
            <div className={`studio-chat-pane ${mobileChatOpen ? 'mobile-open' : ''}`}>
              <div className="chat-pane-header">
                <div className="chat-ai-brand">
                  <div className="chat-bot-avatar">
                    <Bot size={20} />
                  </div>
                  <div>
                    <h3>AI Tutor &amp; Mentor</h3>
                    <span className="chat-context-topic">
                      Context: <strong>{selectedNode?.title || activeRoadmap.title}</strong>
                    </span>
                  </div>
                </div>

                <div className="chat-header-actions">
                  <button
                    type="button"
                    className="chat-action-icon-btn"
                    title="Reset Conversation"
                    onClick={() => initChatForTopic(selectedNode?.title || activeRoadmap.title, activeRoadmap.title)}
                  >
                    <RotateCcw size={16} />
                  </button>

                  <button
                    type="button"
                    className="close-mobile-chat-btn"
                    onClick={() => setMobileChatOpen(false)}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Action Prompt Chips */}
              <div className="chat-action-pills">
                <button
                  type="button"
                  className="action-pill"
                  onClick={() => handleActionPrompt('EXPLAIN')}
                >
                  💡 Explain Concept
                </button>
                <button
                  type="button"
                  className="action-pill"
                  onClick={() => handleActionPrompt('CHALLENGE')}
                >
                  🎯 Coding Challenge
                </button>
                <button
                  type="button"
                  className="action-pill"
                  onClick={() => handleActionPrompt('INTERVIEW')}
                >
                  💼 Interview Q&amp;A
                </button>
                <button
                  type="button"
                  className="action-pill"
                  onClick={() => handleActionPrompt('QUIZ')}
                >
                  📝 Quiz Me
                </button>
                <button
                  type="button"
                  className="action-pill"
                  onClick={() => handleActionPrompt('SCHEDULE')}
                >
                  🗓️ Add to Schedule
                </button>
              </div>

              {/* Chat Messages Stream */}
              <div className="chat-messages-container">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`chat-bubble-row ${msg.sender === 'user' ? 'user-row' : 'ai-row'}`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="bubble-avatar">
                        <Bot size={16} />
                      </div>
                    )}

                    <div className="bubble-content">
                      <div
                        className="bubble-markdown"
                        dangerouslySetInnerHTML={{
                          __html: msg.text
                            .replace(/### (.*?)\n/g, '<h4>$1</h4>')
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                            .replace(/```(.*?)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
                            .replace(/\n\n/g, '<p></p>')
                            .replace(/\n\* /g, '<br/>• '),
                        }}
                      />

                      {/* Quick Suggestions underneath AI messages */}
                      {msg.suggestions?.length > 0 && (
                        <div className="bubble-suggestions">
                          {msg.suggestions.map((s, idx) => (
                            <button
                              key={idx}
                              type="button"
                              className="suggestion-btn"
                              onClick={() => handleSendMessage(s)}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Interactive Quiz Card if active */}
                {activeQuiz && (
                  <div className="interactive-quiz-card">
                    <div className="quiz-header">
                      <HelpCircle size={18} />
                      <span>Knowledge Check</span>
                    </div>
                    <p className="quiz-question">{activeQuiz.question}</p>
                    <div className="quiz-options-list">
                      {activeQuiz.options.map((opt, oIdx) => {
                        const isSelected = quizSelectedOption === oIdx;
                        const isCorrect = oIdx === activeQuiz.correctIndex;
                        let optionClass = 'quiz-opt-btn';

                        if (quizSelectedOption !== null) {
                          if (isSelected && isCorrect) optionClass += ' opt-correct';
                          else if (isSelected && !isCorrect) optionClass += ' opt-wrong';
                          else if (isCorrect) optionClass += ' opt-reveal-correct';
                        }

                        return (
                          <button
                            key={oIdx}
                            type="button"
                            className={optionClass}
                            onClick={() => handleSelectQuizOption(oIdx)}
                            disabled={quizSelectedOption !== null}
                          >
                            <span>{opt}</span>
                            {quizSelectedOption !== null && isCorrect && <Check size={16} />}
                          </button>
                        );
                      })}
                    </div>

                    {quizSelectedOption !== null && (
                      <div
                        className={`quiz-explanation ${quizSelectedOption === activeQuiz.correctIndex ? 'result-success' : 'result-failure'}`}
                      >
                        <strong>
                          {quizSelectedOption === activeQuiz.correctIndex ? '🎉 Correct!' : '❌ Not quite!'}
                        </strong>{' '}
                        {activeQuiz.explanation}
                      </div>
                    )}
                  </div>
                )}

                {aiLoading && (
                  <div className="chat-bubble-row ai-row">
                    <div className="bubble-avatar">
                      <Bot size={16} />
                    </div>
                    <div className="bubble-content loading-bubble">
                      <div className="chat-dot-loader">
                        <span />
                        <span />
                        <span />
                      </div>
                      <span className="loading-label">AI Tutor is thinking...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form
                className="chat-input-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
              >
                <input
                  type="text"
                  placeholder={`Ask AI Tutor about ${selectedNode?.title || 'this topic'}...`}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={aiLoading}
                />
                <button
                  type="submit"
                  className="chat-send-btn"
                  disabled={!inputMessage.trim() || aiLoading}
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>

          {/* Floating Mobile Trigger */}
          <button
            type="button"
            className="mobile-chat-fab"
            onClick={() => setMobileChatOpen(true)}
          >
            <Bot size={20} />
            <span>Chat with Roadmap</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default RoadmapChatPage;
