import { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronRight,
  Layers,
  Sparkles,
  ExternalLink,
  Trash2,
  X,
  GraduationCap,
  Calendar,
  Compass
} from 'lucide-react';
import { Link } from 'react-router-dom';
import courseService from '../services/courseService';
import aiService from '../services/aiService';
import { useAuth } from '../hooks/useAuth';
import './CoursesPage.css';

export function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Active expanded course details
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [courseDetails, setCourseDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Modals state
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseTech, setCourseTech] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseCategory, setCourseCategory] = useState('BACKEND');
  const [creatingCourse, setCreatingCourse] = useState(false);

  // Add Topic Modal
  const [topicModalCourseId, setTopicModalCourseId] = useState(null);
  const [topicTitle, setTopicTitle] = useState('');
  const [topicDesc, setTopicDesc] = useState('');
  const [topicHours, setTopicHours] = useState('5');
  const [topicDifficulty, setTopicDifficulty] = useState('Medium');
  const [addingTopic, setAddingTopic] = useState(false);

  // Add Subtopic Modal
  const [subtopicModalTopicId, setSubtopicModalTopicId] = useState(null);
  const [subtopicTitle, setSubtopicTitle] = useState('');
  const [subtopicDesc, setSubtopicDesc] = useState('');
  const [addingSubtopic, setAddingSubtopic] = useState(false);

  // Scheduling notification state
  const [schedulingTopicId, setSchedulingTopicId] = useState(null);
  const [scheduleNotice, setScheduleNotice] = useState('');

  const categories = [
    { id: 'ALL', label: 'All Disciplines' },
    { id: 'BACKEND', label: 'Core Java & Spring' },
    { id: 'DATABASE', label: 'Databases & SQL' },
    { id: 'SYSTEM_DESIGN', label: 'Architecture & Microservices' },
    { id: 'FRONTEND', label: 'Frontend & React' },
    { id: 'TESTING', label: 'Testing & Quality' },
    { id: 'DEVOPS', label: 'DevOps & AWS Cloud' },
    { id: 'AI', label: 'Generative AI' },
    { id: 'SECURITY', label: 'Security & OWASP' },
    { id: 'PROJECTS', label: 'Portfolio Projects' },
  ];

  useEffect(() => {
    loadCourses();
  }, [selectedCategory]);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await courseService.getCourses(
        selectedCategory !== 'ALL' ? selectedCategory : null
      );
      setCourses(data);
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadCourses();
      return;
    }
    setLoading(true);
    try {
      const data = await courseService.searchCourses(searchQuery);
      setCourses(data);
    } catch (err) {
      console.error('Failed searching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCourseExpand = async (courseId) => {
    if (expandedCourseId === courseId) {
      setExpandedCourseId(null);
      return;
    }
    setExpandedCourseId(courseId);
    if (!courseDetails[courseId]) {
      setLoadingDetails(true);
      try {
        const details = await courseService.getCourseDetails(courseId);
        setCourseDetails((prev) => ({ ...prev, [courseId]: details }));
      } catch (err) {
        console.error('Failed loading course details:', err);
      } finally {
        setLoadingDetails(false);
      }
    }
  };

  const reloadCourseDetails = async (courseId) => {
    try {
      const details = await courseService.getCourseDetails(courseId);
      setCourseDetails((prev) => ({ ...prev, [courseId]: details }));
      // Also update total/completed counts in main list
      setCourses((prev) =>
        prev.map((c) =>
          c.id === courseId
            ? {
                ...c,
                topicCount: details.topicCount,
                completedTopicCount: details.completedTopicCount,
              }
            : c
        )
      );
    } catch (err) {
      console.error('Failed to reload course:', err);
    }
  };

  const handleUpdateTopicStatus = async (courseId, topicId, newStatus) => {
    try {
      await courseService.updateTopicStatus(topicId, newStatus);
      await reloadCourseDetails(courseId);
    } catch (err) {
      console.error('Failed to update topic status:', err);
    }
  };

  const handleScheduleTopicWithAi = async (topicTitle) => {
    setScheduleNotice(`Optimizing AI study schedule for "${topicTitle}"...`);
    try {
      await aiService.generatePlan({
        focusAreas: [topicTitle],
        hoursPerDay: 3,
      });
      setScheduleNotice(`Successfully scheduled "${topicTitle}" in your AI study plan!`);
      setTimeout(() => setScheduleNotice(''), 4000);
    } catch {
      setScheduleNotice(`Added "${topicTitle}" to study queue.`);
      setTimeout(() => setScheduleNotice(''), 3000);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;
    setCreatingCourse(true);
    try {
      await courseService.createCourse({
        title: courseTitle.trim(),
        technology: courseTech.trim() || 'Java Full Stack',
        description: courseDesc.trim() || 'Custom technology track',
        category: courseCategory,
        level: 'Intermediate',
      });
      setShowAddCourseModal(false);
      setCourseTitle('');
      setCourseTech('');
      setCourseDesc('');
      await loadCourses();
    } catch (err) {
      console.error('Failed to create course:', err);
    } finally {
      setCreatingCourse(false);
    }
  };

  const handleAddTopic = async (e) => {
    e.preventDefault();
    if (!topicTitle.trim() || !topicModalCourseId) return;
    setAddingTopic(true);
    try {
      await courseService.addTopic(topicModalCourseId, {
        title: topicTitle.trim(),
        description: topicDesc.trim(),
        estimatedHours: parseInt(topicHours, 10) || 5,
        difficulty: topicDifficulty,
      });
      const cid = topicModalCourseId;
      setTopicModalCourseId(null);
      setTopicTitle('');
      setTopicDesc('');
      await reloadCourseDetails(cid);
    } catch (err) {
      console.error('Failed to add topic:', err);
    } finally {
      setAddingTopic(false);
    }
  };

  const handleAddSubtopic = async (e) => {
    e.preventDefault();
    if (!subtopicTitle.trim() || !subtopicModalTopicId) return;
    setAddingSubtopic(true);
    try {
      await courseService.addSubtopic(subtopicModalTopicId, {
        title: subtopicTitle.trim(),
        description: subtopicDesc.trim(),
      });
      setSubtopicModalTopicId(null);
      setSubtopicTitle('');
      setSubtopicDesc('');
      if (expandedCourseId) {
        await reloadCourseDetails(expandedCourseId);
      }
    } catch (err) {
      console.error('Failed to add subtopic:', err);
    } finally {
      setAddingSubtopic(false);
    }
  };

  return (
    <div className="courses-page-container">
      {/* Page Header */}
      <div className="courses-page-header">
        <div className="courses-header-left">
          <div className="courses-badge">
            <GraduationCap size={18} />
            <span>3-Year Java Developer Curriculum</span>
          </div>
          <h1>Technology Courses &amp; Roadmaps</h1>
          <p>
            Structured hierarchy: Technology → Course → Topic → Subtopic → Practice.
            Designed specifically for professional 3-Year Java Backend and Full-Stack Engineers.
          </p>
        </div>

        <div className="courses-header-actions">
          <Link to="/roadmaps" className="view-flowchart-btn">
            <Compass size={16} />
            <span>Interactive Flowchart</span>
          </Link>

          <button
            type="button"
            className="create-course-btn"
            onClick={() => setShowAddCourseModal(true)}
          >
            <Plus size={16} />
            <span>Create Course</span>
          </button>
        </div>
      </div>

      {scheduleNotice && (
        <div className="schedule-notice-banner">
          <Sparkles size={16} />
          <span>{scheduleNotice}</span>
        </div>
      )}

      {/* Category Tabs */}
      <div className="courses-category-scroll">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`cat-pill ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="courses-search-bar">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search courses, frameworks, technologies (e.g. Spring Boot, Kafka, Redis)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            className="clear-btn"
            onClick={() => {
              setSearchQuery('');
              loadCourses();
            }}
          >
            <X size={14} />
          </button>
        )}
        <button type="submit" className="search-submit-btn">
          Search
        </button>
      </form>

      {/* Course Cards Grid */}
      {loading ? (
        <div className="courses-loading">
          <div className="courses-spinner" />
          <p>Loading developer curriculum...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="courses-empty">
          <BookOpen size={48} className="empty-icon" />
          <h3>No courses found</h3>
          <p>Try searching for a different topic or click "Create Course".</p>
        </div>
      ) : (
        <div className="courses-list">
          {courses.map((course) => {
            const isExpanded = expandedCourseId === course.id;
            const details = courseDetails[course.id];
            const pct =
              course.topicCount > 0
                ? Math.round(
                    ((course.completedTopicCount || 0) / course.topicCount) * 100
                  )
                : 0;

            return (
              <div
                key={course.id}
                className={`course-card ${isExpanded ? 'is-expanded' : ''}`}
              >
                {/* Main Card Header / Summary */}
                <div
                  className="course-summary-row"
                  onClick={() => toggleCourseExpand(course.id)}
                >
                  <div className="course-main-info">
                    <div className="course-meta-pills">
                      <span className="tech-badge">{course.technology}</span>
                      <span className="cat-badge">{course.category}</span>
                      <span className="level-badge">{course.level || 'Intermediate'}</span>
                      {course.isPredefined && (
                        <span className="predefined-badge">Verified Curriculum</span>
                      )}
                    </div>
                    <h2 className="course-title">{course.title}</h2>
                    <p className="course-desc">{course.description}</p>
                  </div>

                  <div className="course-progress-side">
                    <div className="course-stats-preview">
                      <div className="progress-labels">
                        <span className="topics-count">
                          {course.completedTopicCount || 0} / {course.topicCount} Topics
                        </span>
                        <span className="pct-text">{pct}%</span>
                      </div>
                      <div className="course-progress-bar">
                        <div
                          className="course-progress-fill"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <div className="course-chevron">
                      {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                  </div>
                </div>

                {/* Expanded Topics & Subtopics Section */}
                {isExpanded && (
                  <div className="course-expanded-content">
                    <div className="expanded-action-bar">
                      <div className="topics-counter-badge">
                        <Layers size={16} />
                        <span>Curriculum Modules &amp; Topics</span>
                      </div>

                      <button
                        type="button"
                        className="add-topic-inline-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTopicModalCourseId(course.id);
                        }}
                      >
                        <Plus size={14} />
                        <span>Add Topic to Course</span>
                      </button>
                    </div>

                    {loadingDetails && !details ? (
                      <div className="details-loading">
                        <div className="courses-spinner small" />
                        <span>Loading topics &amp; subtopics...</span>
                      </div>
                    ) : !details?.topics || details.topics.length === 0 ? (
                      <div className="no-topics-notice">
                        <p>No topics added to this course yet.</p>
                        <button
                          type="button"
                          className="btn-link"
                          onClick={() => setTopicModalCourseId(course.id)}
                        >
                          + Add the first topic
                        </button>
                      </div>
                    ) : (
                      <div className="topics-accordion-list">
                        {details.topics.map((topic, idx) => {
                          const isDone =
                            topic.userStatus === 'COMPLETED' ||
                            topic.userStatus === 'SOLVED';

                          return (
                            <div
                              key={topic.id}
                              className={`topic-item-card ${isDone ? 'topic-completed' : ''}`}
                            >
                              <div className="topic-header-row">
                                <div className="topic-index-badge">
                                  {idx + 1}
                                </div>

                                <div className="topic-text-col">
                                  <div className="topic-title-line">
                                    <h4 className="topic-title">{topic.title}</h4>
                                    <span className={`topic-diff ${topic.difficulty?.toLowerCase()}`}>
                                      {topic.difficulty}
                                    </span>
                                    <span className="topic-hours">
                                      <Clock size={12} /> {topic.estimatedHours || 4}h
                                    </span>
                                  </div>
                                  {topic.description && (
                                    <p className="topic-desc">{topic.description}</p>
                                  )}
                                </div>

                                <div className="topic-controls">
                                  <select
                                    className={`topic-status-select status-${(topic.userStatus || 'not_started').toLowerCase()}`}
                                    value={topic.userStatus || 'NOT_STARTED'}
                                    onChange={(e) =>
                                      handleUpdateTopicStatus(
                                        course.id,
                                        topic.id,
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="NOT_STARTED">Not Started</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="COMPLETED">Completed ✓</option>
                                  </select>

                                  <button
                                    type="button"
                                    className="ai-schedule-icon-btn"
                                    title="Add to AI Study Schedule"
                                    onClick={() => handleScheduleTopicWithAi(topic.title)}
                                  >
                                    <Sparkles size={15} />
                                  </button>
                                </div>
                              </div>

                              {/* Subtopics Checklist / Chips */}
                              <div className="subtopics-container">
                                <div className="subtopics-list">
                                  {topic.subtopics && topic.subtopics.length > 0 ? (
                                    topic.subtopics.map((st) => (
                                      <div key={st.id} className="subtopic-chip">
                                        <CheckCircle2 size={13} className="subtopic-check" />
                                        <span className="subtopic-title">{st.title}</span>
                                      </div>
                                    ))
                                  ) : (
                                    <span className="no-subtopics-text">
                                      No subtopics defined yet.
                                    </span>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  className="add-subtopic-btn"
                                  onClick={() => setSubtopicModalTopicId(topic.id)}
                                >
                                  <Plus size={12} />
                                  <span>Add Subtopic</span>
                                </button>
                              </div>

                              {/* Challenge project / concept snippet if any */}
                              {topic.challengeProject && (
                                <div className="challenge-project-banner">
                                  <strong>Hands-on Challenge:</strong>{' '}
                                  {topic.challengeProject}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Create Course (Only name required) */}
      {showAddCourseModal && (
        <div className="modal-overlay" onClick={() => setShowAddCourseModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-row">
                <Plus size={20} className="modal-header-icon" />
                <h3>Create New Learning Course</h3>
              </div>
              <button
                className="modal-close"
                onClick={() => setShowAddCourseModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="modal-form">
              <div className="form-group">
                <label>Course Name / Title * (Only name required)</label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Microservices with Spring Cloud & Kafka"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Technology / Framework</label>
                  <input
                    type="text"
                    placeholder="e.g. Spring Cloud"
                    value={courseTech}
                    onChange={(e) => setCourseTech(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value)}
                  >
                    <option value="BACKEND">Core Java &amp; Spring</option>
                    <option value="DATABASE">Databases &amp; SQL</option>
                    <option value="SYSTEM_DESIGN">System Design &amp; Microservices</option>
                    <option value="FRONTEND">Frontend &amp; React</option>
                    <option value="TESTING">Testing &amp; Quality</option>
                    <option value="DEVOPS">DevOps &amp; Cloud</option>
                    <option value="AI">Generative AI</option>
                    <option value="SECURITY">Security</option>
                    <option value="PROJECTS">Projects</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Short description of what this course covers..."
                  value={courseDesc}
                  onChange={(e) => setCourseDesc(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowAddCourseModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-save"
                  disabled={creatingCourse}
                >
                  {creatingCourse ? 'Creating...' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Topic (Only name required) */}
      {topicModalCourseId && (
        <div className="modal-overlay" onClick={() => setTopicModalCourseId(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-row">
                <Plus size={20} className="modal-header-icon" />
                <h3>Add Topic to Course</h3>
              </div>
              <button
                className="modal-close"
                onClick={() => setTopicModalCourseId(null)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTopic} className="modal-form">
              <div className="form-group">
                <label>Topic Title * (Only name required)</label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. CompletableFuture & Async Programming"
                  value={topicTitle}
                  onChange={(e) => setTopicTitle(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Difficulty</label>
                  <select
                    value={topicDifficulty}
                    onChange={(e) => setTopicDifficulty(e.target.value)}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Estimated Hours</label>
                  <input
                    type="number"
                    min="1"
                    value={topicHours}
                    onChange={(e) => setTopicHours(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Topic Overview (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Key concepts or objectives..."
                  value={topicDesc}
                  onChange={(e) => setTopicDesc(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setTopicModalCourseId(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-save"
                  disabled={addingTopic}
                >
                  {addingTopic ? 'Adding...' : 'Add Topic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Subtopic (Only name required) */}
      {subtopicModalTopicId && (
        <div className="modal-overlay" onClick={() => setSubtopicModalTopicId(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-row">
                <Plus size={20} className="modal-header-icon" />
                <h3>Add Subtopic</h3>
              </div>
              <button
                className="modal-close"
                onClick={() => setSubtopicModalTopicId(null)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubtopic} className="modal-form">
              <div className="form-group">
                <label>Subtopic Name * (Only name required)</label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. ForkJoinPool & Thread Pool Configuration"
                  value={subtopicTitle}
                  onChange={(e) => setSubtopicTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Quick Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="Key points or reference URL..."
                  value={subtopicDesc}
                  onChange={(e) => setSubtopicDesc(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setSubtopicModalTopicId(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-save"
                  disabled={addingSubtopic}
                >
                  {addingSubtopic ? 'Adding...' : 'Add Subtopic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CoursesPage;
