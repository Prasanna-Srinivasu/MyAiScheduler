import { useState, useEffect, useMemo } from 'react';
import {
  Code,
  CheckCircle,
  Clock,
  RotateCcw,
  ExternalLink,
  Plus,
  Search,
  Filter,
  Sparkles,
  BookOpen,
  Check,
  Edit3,
  X,
  TrendingUp,
  BrainCircuit,
  Award,
  Layers,
  SortAsc,
  Cpu,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Copy,
  AlertTriangle,
  HelpCircle,
  CheckCheck,
  Compass
} from 'lucide-react';
import practiceService from '../services/practiceService';
import { useAuth } from '../hooks/useAuth';
import { getConceptGuide, getProblemInterviewWalkthrough } from '../data/interviewConceptGuides';
import './PracticePlayground.css';

export function PracticePlayground() {
  const { user } = useAuth();

  // Metadata & high-level filtering states
  const [metadata, setMetadata] = useState({
    technologies: ['ALL', 'DSA', 'Java'],
    concepts: [],
    dsaCount: 0,
    javaCount: 0,
    totalCount: 0,
    summary: [],
  });

  const [activeTechnology, setActiveTechnology] = useState('ALL'); // 'ALL' | 'DSA' | 'Java'
  const [selectedConcept, setSelectedConcept] = useState('ALL');
  const [selectedMethod, setSelectedMethod] = useState('ALL');
  const [sortBy, setSortBy] = useState('EASY_TO_HARD'); // 'EASY_TO_HARD' | 'HARD_TO_EASY' | 'LEETCODE_ASC' | 'TITLE_ASC'

  // Pattern, difficulty, and status filters
  const [patterns, setPatterns] = useState([]);
  const [activePattern, setActivePattern] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Problem list & stats
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState({
    totalSolved: 0,
    totalProblems: 0,
    easySolved: 0,
    easyTotal: 0,
    mediumSolved: 0,
    mediumTotal: 0,
    hardSolved: 0,
    hardTotal: 0,
    needsRevisionCount: 0,
  });
  const [loading, setLoading] = useState(true);

  // Interview Concept Guide state
  const [showConceptGuide, setShowConceptGuide] = useState(true);
  const [activeGuideTab, setActiveGuideTab] = useState('SIGNALS'); // 'SIGNALS' | 'PRINCIPLES' | 'TEMPLATE' | 'PITFALLS'
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  // Problem Interview Walkthrough Modal state
  const [activeWalkthroughProblem, setActiveWalkthroughProblem] = useState(null);

  // Notes Modal state
  const [activeNotesProblem, setActiveNotesProblem] = useState(null);
  const [notesContent, setNotesContent] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  // Add Custom Problem Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProblem, setNewProblem] = useState({
    title: '',
    technology: 'DSA',
    concept: 'Arrays',
    method: 'Two Pointers',
    pattern: 'Arrays & Hashing',
    difficulty: 'Medium',
    leetcodeNumber: '',
    leetcodeUrl: '',
    description: '',
  });
  const [addLoading, setAddLoading] = useState(false);

  // Initial loading
  useEffect(() => {
    loadMetadataAndStats();
  }, []);

  // Fetch problems when filters or sort change
  useEffect(() => {
    loadProblems();
  }, [activeTechnology, selectedConcept, selectedMethod, activePattern, difficultyFilter, statusFilter, sortBy]);

  const loadMetadataAndStats = async () => {
    try {
      const [metaData, patternsData, statsData] = await Promise.all([
        practiceService.getMetadata().catch(() => null),
        practiceService.getPatterns().catch(() => []),
        practiceService.getStats().catch(() => null),
      ]);

      if (metaData) {
        setMetadata(metaData);
      }
      if (patternsData) {
        setPatterns(patternsData);
      }
      if (statsData) {
        setStats(statsData);
      }
    } catch (err) {
      console.error('Failed to load metadata/patterns/stats:', err);
    }
  };

  const loadProblems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeTechnology !== 'ALL') params.technology = activeTechnology;
      if (selectedConcept !== 'ALL') params.concept = selectedConcept;
      if (selectedMethod !== 'ALL') params.method = selectedMethod;
      if (activePattern !== 'All') params.pattern = activePattern;
      if (difficultyFilter !== 'ALL') params.difficulty = difficultyFilter;
      if (statusFilter !== 'ALL') params.status = statusFilter;
      params.sortBy = sortBy;

      const data = await practiceService.getProblems(params);
      setProblems(data);
    } catch (err) {
      console.error('Failed to load problems:', err);
    } finally {
      setLoading(false);
    }
  };

  // Active concept interview guide
  const currentGuide = useMemo(() => {
    return getConceptGuide(selectedConcept);
  }, [selectedConcept]);

  // Problem-specific walkthrough data
  const walkthroughData = useMemo(() => {
    return activeWalkthroughProblem
      ? getProblemInterviewWalkthrough(activeWalkthroughProblem)
      : null;
  }, [activeWalkthroughProblem]);

  // Derive concepts based on activeTechnology
  const visibleConcepts = useMemo(() => {
    const all = metadata.concepts || [];
    if (activeTechnology === 'DSA') {
      return all.filter((c) => !c.toLowerCase().startsWith('java'));
    }
    if (activeTechnology === 'Java') {
      return all.filter((c) => c.toLowerCase().startsWith('java'));
    }
    return all;
  }, [metadata.concepts, activeTechnology]);

  // Derive methods for the selected concept
  const availableMethods = useMemo(() => {
    if (selectedConcept === 'Arrays') {
      return [
        'Two Pointers',
        'Sliding Window',
        "Kadane's Algorithm",
        'Cyclic Sort',
        'Dutch National Flag',
        'Prefix Sum',
        'Matrix 2D',
        'Intervals',
        'Hash Map & Frequency',
      ];
    }
    // Extract unique methods from loaded problems
    const methodSet = new Set();
    problems.forEach((p) => {
      if (p.method && p.method.trim()) {
        methodSet.add(p.method.trim());
      }
    });
    return Array.from(methodSet);
  }, [selectedConcept, problems]);

  const handleTechChange = (tech) => {
    setActiveTechnology(tech);
    setSelectedConcept('ALL');
    setSelectedMethod('ALL');
    setActivePattern('All');
  };

  const handleConceptChange = (concept) => {
    setSelectedConcept(concept);
    setSelectedMethod('ALL');
    setActivePattern('All');
    setShowConceptGuide(true);
  };

  const handleMethodChange = (method) => {
    setSelectedMethod((prev) => (prev === method ? 'ALL' : method));
  };

  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  const handleStatusChange = async (problemId, newStatus) => {
    try {
      await practiceService.updateProblemStatus(problemId, newStatus);
      setProblems((prev) =>
        prev.map((p) =>
          p.id === problemId ? { ...p, userStatus: newStatus } : p
        )
      );
      // Refresh stats
      const updatedStats = await practiceService.getStats();
      setStats(updatedStats);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const openNotesModal = (problem) => {
    setActiveNotesProblem(problem);
    setNotesContent(problem.solutionNotes || problem.userNotes || '');
  };

  const handleSaveNotes = async () => {
    if (!activeNotesProblem) return;
    setSavingNotes(true);
    try {
      await practiceService.updateProblemStatus(
        activeNotesProblem.id,
        activeNotesProblem.userStatus || 'IN_PROGRESS',
        notesContent
      );
      setProblems((prev) =>
        prev.map((p) =>
          p.id === activeNotesProblem.id
            ? {
                ...p,
                solutionNotes: notesContent,
                userNotes: notesContent,
                userStatus: p.userStatus || 'IN_PROGRESS',
              }
            : p
        )
      );
      setActiveNotesProblem(null);
    } catch (err) {
      console.error('Failed to save solution notes:', err);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleAddProblem = async (e) => {
    e.preventDefault();
    if (!newProblem.title.trim()) return;
    setAddLoading(true);
    try {
      await practiceService.createProblem({
        ...newProblem,
        leetcodeNumber: newProblem.leetcodeNumber
          ? parseInt(newProblem.leetcodeNumber, 10)
          : null,
      });
      setShowAddModal(false);
      setNewProblem({
        title: '',
        technology: activeTechnology !== 'ALL' ? activeTechnology : 'DSA',
        concept: selectedConcept !== 'ALL' ? selectedConcept : 'Arrays',
        method: '',
        pattern: 'Arrays & Hashing',
        difficulty: 'Medium',
        leetcodeNumber: '',
        leetcodeUrl: '',
        description: '',
      });
      await loadProblems();
      await loadMetadataAndStats();
    } catch (err) {
      console.error('Failed to create problem:', err);
    } finally {
      setAddLoading(false);
    }
  };

  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(query) ||
        (p.leetcodeNumber && p.leetcodeNumber.toString().includes(query)) ||
        (p.pattern && p.pattern.toLowerCase().includes(query)) ||
        (p.concept && p.concept.toLowerCase().includes(query)) ||
        (p.method && p.method.toLowerCase().includes(query)) ||
        (p.companies && p.companies.toLowerCase().includes(query))
      );
    });
  }, [problems, searchQuery]);

  const getDifficultyClass = (diff) => {
    switch (diff?.toUpperCase()) {
      case 'EASY':
        return 'diff-easy';
      case 'HARD':
        return 'diff-hard';
      default:
        return 'diff-medium';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SOLVED':
        return { label: 'Solved', class: 'status-solved', icon: <CheckCircle size={14} /> };
      case 'IN_PROGRESS':
        return { label: 'In Progress', class: 'status-progress', icon: <Clock size={14} /> };
      case 'NEEDS_REVISION':
        return { label: 'Needs Revision', class: 'status-revision', icon: <RotateCcw size={14} /> };
      default:
        return { label: 'Not Started', class: 'status-none', icon: null };
    }
  };

  return (
    <div className="practice-playground-page">
      {/* Header Banner */}
      <div className="practice-header">
        <div className="practice-title-group">
          <div className="practice-badge">
            <BrainCircuit size={18} />
            <span>Developer Interview Masterclass</span>
          </div>
          <h1>Concept Mastery &amp; Interview Practice</h1>
          <p>
            Designed for software engineers preparing for top tech &amp; Java backend interviews.
            Understand core algorithmic concepts &amp; canonical templates first, then practice curated questions sorted <strong>Easy to Hard</strong>.
          </p>
        </div>

        <div className="practice-action-buttons">
          <button
            type="button"
            className="add-problem-btn"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} />
            <span>Add Custom Problem</span>
          </button>
        </div>
      </div>

      {/* DSA Stats Overview */}
      <div className="dsa-stats-grid">
        <div className="dsa-stat-card total-card">
          <div className="stat-icon-wrap">
            <Award size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Interview Prepared</span>
            <div className="stat-num-row">
              <span className="stat-val">{stats.totalSolved}</span>
              <span className="stat-denom">/ {stats.totalProblems || metadata.totalCount || 151}</span>
            </div>
            <div className="stat-bar-track">
              <div
                className="stat-bar-fill"
                style={{
                  width: `${
                    (stats.totalProblems || metadata.totalCount) > 0
                      ? (stats.totalSolved / (stats.totalProblems || metadata.totalCount)) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="dsa-stat-card easy-card">
          <div className="stat-icon-wrap easy-icon">
            <Check size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Easy (Concept Base)</span>
            <div className="stat-num-row">
              <span className="stat-val easy-val">{stats.easySolved}</span>
              <span className="stat-denom">/ {stats.easyTotal}</span>
            </div>
            <span className="stat-pct">
              {stats.easyTotal > 0 ? Math.round((stats.easySolved / stats.easyTotal) * 100) : 0}% Done
            </span>
          </div>
        </div>

        <div className="dsa-stat-card medium-card">
          <div className="stat-icon-wrap med-icon">
            <TrendingUp size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Medium (Interview Core)</span>
            <div className="stat-num-row">
              <span className="stat-val med-val">{stats.mediumSolved}</span>
              <span className="stat-denom">/ {stats.mediumTotal}</span>
            </div>
            <span className="stat-pct">
              {stats.mediumTotal > 0 ? Math.round((stats.mediumSolved / stats.mediumTotal) * 100) : 0}% Done
            </span>
          </div>
        </div>

        <div className="dsa-stat-card hard-card">
          <div className="stat-icon-wrap hard-icon">
            <Sparkles size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Hard (Senior Level)</span>
            <div className="stat-num-row">
              <span className="stat-val hard-val">{stats.hardSolved}</span>
              <span className="stat-denom">/ {stats.hardTotal}</span>
            </div>
            <span className="stat-pct">
              {stats.hardTotal > 0 ? Math.round((stats.hardSolved / stats.hardTotal) * 100) : 0}% Done
            </span>
          </div>
        </div>

        <div className="dsa-stat-card revision-card">
          <div className="stat-icon-wrap rev-icon">
            <RotateCcw size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Needs Revision</span>
            <div className="stat-num-row">
              <span className="stat-val rev-val">{stats.needsRevisionCount}</span>
              <span className="stat-denom">flashcards</span>
            </div>
            <span className="stat-pct">spaced repetition</span>
          </div>
        </div>
      </div>

      {/* 1. Technology Toggle Bar */}
      <div className="tech-toggle-bar">
        <button
          type="button"
          className={`tech-tab-btn ${activeTechnology === 'ALL' ? 'active' : ''}`}
          onClick={() => handleTechChange('ALL')}
        >
          <Layers size={18} />
          <span>All Technologies</span>
          <span className="tech-badge-count">{metadata.totalCount || 151}</span>
        </button>

        <button
          type="button"
          className={`tech-tab-btn ${activeTechnology === 'DSA' ? 'active' : ''}`}
          onClick={() => handleTechChange('DSA')}
        >
          <Code size={18} />
          <span>DSA &amp; LeetCode</span>
          <span className="tech-badge-count">{metadata.dsaCount || 123}</span>
        </button>

        <button
          type="button"
          className={`tech-tab-btn ${activeTechnology === 'Java' ? 'active' : ''}`}
          onClick={() => handleTechChange('Java')}
        >
          <Cpu size={18} />
          <span>Java Concept Problems</span>
          <span className="tech-badge-count">{metadata.javaCount || 28}</span>
        </button>
      </div>

      {/* 2. Concept Pills Strip */}
      <div className="concept-tabs-wrapper">
        <div className="concept-tabs-scroll">
          <button
            type="button"
            className={`concept-pill-btn ${selectedConcept === 'ALL' ? 'active' : ''}`}
            onClick={() => handleConceptChange('ALL')}
          >
            <span>All Concepts Playbook</span>
          </button>
          {visibleConcepts.map((concept) => (
            <button
              key={concept}
              type="button"
              className={`concept-pill-btn ${selectedConcept === concept ? 'active' : ''}`}
              onClick={() => handleConceptChange(concept)}
            >
              <span>{concept}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Interactive Interview Concept Masterclass & Guide Card */}
      <div className="interview-guide-container">
        <div
          className="interview-guide-header"
          onClick={() => setShowConceptGuide(!showConceptGuide)}
        >
          <div className="guide-header-left">
            <div className="guide-icon-badge">
              <BookOpen size={20} />
            </div>
            <div className="guide-title-text">
              <h3>
                {currentGuide.title}
                <span className={`tech-tag-pill ${currentGuide.technology === 'Java' ? 'tech-java' : 'tech-dsa'}`}>
                  {currentGuide.technology}
                </span>
              </h3>
              <p>{currentGuide.subtitle}</p>
            </div>
          </div>
          <div className="guide-header-right">
            <button
              type="button"
              className="guide-toggle-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowConceptGuide(!showConceptGuide);
              }}
            >
              {showConceptGuide ? (
                <>
                  <ChevronUp size={15} />
                  <span>Collapse Masterclass</span>
                </>
              ) : (
                <>
                  <ChevronDown size={15} />
                  <span>Expand Masterclass</span>
                </>
              )}
            </button>
          </div>
        </div>

        {showConceptGuide && (
          <div className="interview-guide-body">
            {/* Guide Tabs */}
            <div className="guide-nav-tabs">
              <button
                type="button"
                className={`guide-tab-btn ${activeGuideTab === 'SIGNALS' ? 'active' : ''}`}
                onClick={() => setActiveGuideTab('SIGNALS')}
              >
                <Compass size={15} />
                <span>Pattern Signals (&quot;When to Use&quot;)</span>
              </button>

              <button
                type="button"
                className={`guide-tab-btn ${activeGuideTab === 'PRINCIPLES' ? 'active' : ''}`}
                onClick={() => setActiveGuideTab('PRINCIPLES')}
              >
                <Lightbulb size={15} />
                <span>Core Mental Model</span>
              </button>

              <button
                type="button"
                className={`guide-tab-btn ${activeGuideTab === 'TEMPLATE' ? 'active' : ''}`}
                onClick={() => setActiveGuideTab('TEMPLATE')}
              >
                <Code size={15} />
                <span>Canonical Java Template</span>
              </button>

              <button
                type="button"
                className={`guide-tab-btn ${activeGuideTab === 'PITFALLS' ? 'active' : ''}`}
                onClick={() => setActiveGuideTab('PITFALLS')}
              >
                <AlertTriangle size={15} />
                <span>Interview Traps &amp; Checklist</span>
              </button>
            </div>

            {/* Tab 1: Pattern Signals */}
            {activeGuideTab === 'SIGNALS' && (
              <div className="guide-section-content">
                <div className="signals-grid">
                  {currentGuide.whenToUse?.map((item, idx) => (
                    <div key={idx} className="signal-card">
                      <div className="signal-method-title">
                        <span>{item.method}</span>
                        <span className="signal-complexity">{item.complexity}</span>
                      </div>
                      <p className="signal-text">{item.signal}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Core Mental Model */}
            {activeGuideTab === 'PRINCIPLES' && (
              <div className="guide-section-content">
                <div className="principles-grid">
                  {currentGuide.keyConcepts?.map((concept, idx) => (
                    <div key={idx} className="principle-box">
                      {concept}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Java Blueprint Code */}
            {activeGuideTab === 'TEMPLATE' && (
              <div className="guide-section-content">
                <div className="template-code-box">
                  <div className="template-code-header">
                    <span>Java Canonical Blueprint</span>
                    <button
                      type="button"
                      className="copy-code-btn"
                      onClick={() => handleCopyCode(currentGuide.templateCode)}
                    >
                      {copiedTemplate ? (
                        <>
                          <CheckCheck size={14} color="#10b981" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy Template</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="code-pre">
                    <code>{currentGuide.templateCode}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* Tab 4: Pitfalls & Checklist */}
            {activeGuideTab === 'PITFALLS' && (
              <div className="guide-section-content">
                <h4 style={{ color: '#ef4444', margin: '0 0 10px 0', fontSize: '0.95rem' }}>
                  ⚠️ Critical Edge Cases &amp; Interview Traps
                </h4>
                <div className="pitfalls-list" style={{ marginBottom: '1.25rem' }}>
                  {currentGuide.pitfalls?.map((pitfall, idx) => (
                    <div key={idx} className="pitfall-item">
                      <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{pitfall}</span>
                    </div>
                  ))}
                </div>

                <h4 style={{ color: '#10b981', margin: '0 0 10px 0', fontSize: '0.95rem' }}>
                  ✅ 5-Step Interview Communication Checklist
                </h4>
                <div className="checklist-items">
                  {currentGuide.interviewChecklist?.map((check, idx) => (
                    <div key={idx} className="checklist-item">
                      <Check size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{check}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Method / Pattern Sub-Filter Strip (Specialized for Concepts like Arrays) */}
      {(selectedConcept !== 'ALL' || availableMethods.length > 0) && (
        <div className="method-chips-wrapper">
          <span className="method-chips-label">
            <Filter size={13} />
            {selectedConcept === 'Arrays' ? 'Array Patterns & Methods:' : 'Pattern Methods:'}
          </span>
          <button
            type="button"
            className={`method-chip ${selectedMethod === 'ALL' ? 'active' : ''}`}
            onClick={() => setSelectedMethod('ALL')}
          >
            All Methods
          </button>
          {availableMethods.map((m) => (
            <button
              key={m}
              type="button"
              className={`method-chip ${selectedMethod === m ? 'active' : ''}`}
              onClick={() => handleMethodChange(m)}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {/* 5. Controls Row: Search, Difficulty, Status, and Sort Order */}
      <div className="practice-controls-row">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search problems by title, LeetCode #, method, or company (Google, Amazon)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="filter-dropdowns">
          {/* Difficulty filter */}
          <div className="filter-item">
            <Filter size={14} />
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="ALL">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="filter-item">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="SOLVED">Solved</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="NEEDS_REVISION">Needs Revision</option>
              <option value="NOT_STARTED">Not Started</option>
            </select>
          </div>

          {/* Sort Order Selector (Defaults to Easy to Hard) */}
          <div className="sort-item">
            <SortAsc size={14} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              title="Sort Problems"
            >
              <option value="EASY_TO_HARD">Easy → Hard (Default)</option>
              <option value="HARD_TO_EASY">Hard → Easy</option>
              <option value="LEETCODE_ASC">LeetCode # (Ascending)</option>
              <option value="TITLE_ASC">Problem Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 6. Practice Problems Table */}
      <div className="problems-table-container">
        {loading ? (
          <div className="practice-loading">
            <div className="practice-spinner" />
            <p>Loading problems...</p>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="empty-problems-state">
            <Code size={48} className="empty-icon" />
            <h3>No problems found</h3>
            <p>Try adjusting your search query, technology, or pattern filters.</p>
          </div>
        ) : (
          <table className="problems-table">
            <thead>
              <tr>
                <th className="th-status">Status</th>
                <th className="th-num">#</th>
                <th className="th-title">Problem Title</th>
                <th className="th-tech-concept">Technology &amp; Concept</th>
                <th className="th-difficulty">Difficulty</th>
                <th className="th-hint" style={{ width: '90px' }}>Strategy</th>
                <th className="th-notes">Notes</th>
                <th className="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map((prob) => {
                const statusMeta = getStatusBadge(prob.userStatus);
                const companyList = prob.companies
                  ? prob.companies.split(',').map((c) => c.trim()).filter(Boolean)
                  : [];

                return (
                  <tr
                    key={prob.id}
                    className={`prob-row status-${(prob.userStatus || 'none').toLowerCase()}`}
                  >
                    <td className="td-status">
                      <select
                        className={`status-select ${statusMeta.class}`}
                        value={prob.userStatus || 'NOT_STARTED'}
                        onChange={(e) => handleStatusChange(prob.id, e.target.value)}
                      >
                        <option value="NOT_STARTED">Not Started</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="SOLVED">Solved ✓</option>
                        <option value="NEEDS_REVISION">Needs Revision ↺</option>
                      </select>
                    </td>

                    <td className="td-num">
                      <span className="lc-num">
                        {prob.leetcodeNumber ? `#${prob.leetcodeNumber}` : '-'}
                      </span>
                    </td>

                    <td className="td-title">
                      <div className="title-wrapper">
                        <a
                          href={prob.leetcodeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="problem-link"
                        >
                          <span className="problem-title-text">{prob.title}</span>
                          <ExternalLink size={13} className="ext-icon" />
                        </a>
                        {prob.isCustom && <span className="custom-badge">Custom</span>}
                      </div>
                      {prob.description && (
                        <p className="problem-desc-preview">{prob.description}</p>
                      )}
                      {companyList.length > 0 && (
                        <div className="companies-tag-row">
                          {companyList.slice(0, 3).map((comp) => (
                            <span key={comp} className="company-tiny-pill">
                              {comp}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="td-tech-concept">
                      <div className="tech-concept-tags">
                        <span
                          className={`tech-tag-pill ${
                            prob.technology === 'Java' ? 'tech-java' : 'tech-dsa'
                          }`}
                        >
                          {prob.technology || 'DSA'}
                        </span>
                        <span className="concept-badge-tag">
                          {prob.concept || prob.pattern}
                        </span>
                        {prob.method && (
                          <span className="method-badge-tag" title="Algorithm Method / Pattern">
                            {prob.method}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="td-difficulty">
                      <span className={`diff-pill ${getDifficultyClass(prob.difficulty)}`}>
                        {prob.difficulty}
                      </span>
                    </td>

                    {/* Interview Walkthrough / Strategy Hint */}
                    <td className="td-hint">
                      <button
                        type="button"
                        className="hint-btn"
                        onClick={() => setActiveWalkthroughProblem(prob)}
                        title="View Interview Strategy & Hints"
                      >
                        <Lightbulb size={13} />
                        <span>Guide</span>
                      </button>
                    </td>

                    <td className="td-notes">
                      <button
                        type="button"
                        className={`notes-btn ${
                          prob.solutionNotes || prob.userNotes ? 'has-notes' : ''
                        }`}
                        onClick={() => openNotesModal(prob)}
                        title={
                          prob.solutionNotes || prob.userNotes
                            ? 'View/Edit Solution Notes'
                            : 'Add Notes'
                        }
                      >
                        <Edit3 size={14} />
                        <span>
                          {prob.solutionNotes || prob.userNotes ? 'Notes' : '+ Note'}
                        </span>
                      </button>
                    </td>

                    <td className="td-actions">
                      <a
                        href={prob.leetcodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="solve-btn"
                      >
                        <span>Solve</span>
                        <ExternalLink size={12} />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* 7. Problem Interview Walkthrough Modal */}
      {activeWalkthroughProblem && walkthroughData && (
        <div className="modal-overlay" onClick={() => setActiveWalkthroughProblem(null)}>
          <div
            className="modal-card walkthrough-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-title-row">
                <Lightbulb size={22} color="#f59e0b" />
                <h3>Interview Guide: {walkthroughData.title}</h3>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setActiveWalkthroughProblem(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {/* Badges bar */}
              <div className="walkthrough-badge-bar">
                <span className={`diff-pill ${getDifficultyClass(walkthroughData.difficulty)}`}>
                  {walkthroughData.difficulty}
                </span>
                <span className="concept-badge-tag">{walkthroughData.concept}</span>
                <span className="method-badge-tag">{walkthroughData.pattern}</span>
                {walkthroughData.companies.map((c) => (
                  <span key={c} className="company-tiny-pill">
                    {c}
                  </span>
                ))}
              </div>

              {/* Step 1: Clarifying Questions */}
              <div className="walkthrough-step-box">
                <div className="step-box-header">
                  <HelpCircle size={16} />
                  <span>Step 1: Clarifying Questions to Ask the Interviewer</span>
                </div>
                <div className="step-box-body">
                  <ul>
                    {walkthroughData.clarifyingQuestions.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Step 2: Brute Force */}
              <div className="walkthrough-step-box">
                <div className="step-box-header" style={{ color: '#f87171' }}>
                  <AlertTriangle size={16} />
                  <span>Step 2: Brute Force &amp; Why it is Suboptimal</span>
                </div>
                <div className="step-box-body">
                  <p>{walkthroughData.bruteForceApproach.explanation}</p>
                  <p style={{ color: '#fca5a5', marginTop: '6px' }}>
                    <strong>Why it fails:</strong> {walkthroughData.bruteForceApproach.whySuboptimal}
                  </p>
                  <div className="complexity-pills-row">
                    <span className="comp-pill time-pill">
                      Time: {walkthroughData.bruteForceApproach.timeComplexity}
                    </span>
                    <span className="comp-pill space-pill">
                      Space: {walkthroughData.bruteForceApproach.spaceComplexity}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 3: Optimal Strategy */}
              <div className="walkthrough-step-box">
                <div className="step-box-header" style={{ color: '#34d399' }}>
                  <Sparkles size={16} />
                  <span>Step 3: Optimal Interview Pattern &amp; Key Intuition</span>
                </div>
                <div className="step-box-body">
                  <p>{walkthroughData.optimalStrategy.keyIntuition}</p>
                  <div className="complexity-pills-row">
                    <span className="comp-pill time-pill">
                      Time: {walkthroughData.optimalStrategy.timeComplexity}
                    </span>
                    <span className="comp-pill space-pill">
                      Space: {walkthroughData.optimalStrategy.spaceComplexity}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 4: Edge Cases */}
              <div className="walkthrough-step-box">
                <div className="step-box-header" style={{ color: '#fbbf24' }}>
                  <CheckCheck size={16} />
                  <span>Step 4: Edge Cases to Dry-Run Before Coding</span>
                </div>
                <div className="step-box-body">
                  <ul>
                    {walkthroughData.interviewEdgeCases.map((ec, idx) => (
                      <li key={idx}>{ec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setActiveWalkthroughProblem(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn-save"
                onClick={() => {
                  const prob = activeWalkthroughProblem;
                  setActiveWalkthroughProblem(null);
                  openNotesModal(prob);
                }}
              >
                Add Personal Notes
              </button>
              {activeWalkthroughProblem.leetcodeUrl && (
                <a
                  href={activeWalkthroughProblem.leetcodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="solve-btn"
                  style={{ background: 'var(--study-blue, #3b82f6)', color: '#fff' }}
                >
                  <span>Practice on LeetCode</span>
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 8. Solution Notes Modal */}
      {activeNotesProblem && (
        <div className="modal-overlay" onClick={() => setActiveNotesProblem(null)}>
          <div
            className="modal-card notes-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-title-row">
                <BookOpen size={20} className="modal-header-icon" />
                <h3>Solution Notes: {activeNotesProblem.title}</h3>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setActiveNotesProblem(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-subtext">
                Document your time/space complexity, intuition, and edge cases for quick revision before your interview.
              </p>
              <textarea
                className="notes-textarea"
                rows={10}
                placeholder="Example:&#10;Approach: Two Pointers from both ends.&#10;Time Complexity: O(n)&#10;Space Complexity: O(1)&#10;Key Insight: If sum < target, advance left pointer. Otherwise decrement right pointer.&#10;Edge Cases: Array with negative numbers or duplicates."
                value={notesContent}
                onChange={(e) => setNotesContent(e.target.value)}
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setActiveNotesProblem(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-save"
                onClick={handleSaveNotes}
                disabled={savingNotes}
              >
                {savingNotes ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Add Custom Problem Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div
            className="modal-card add-problem-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-title-row">
                <Plus size={20} className="modal-header-icon" />
                <h3>Add Custom Practice Problem</h3>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddProblem} className="add-problem-form">
              <div className="form-group">
                <label>Problem Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Subarray Sum Equals K"
                  value={newProblem.title}
                  onChange={(e) =>
                    setNewProblem({ ...newProblem, title: e.target.value })
                  }
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Technology *</label>
                  <select
                    value={newProblem.technology}
                    onChange={(e) =>
                      setNewProblem({ ...newProblem, technology: e.target.value })
                    }
                  >
                    <option value="DSA">DSA &amp; LeetCode</option>
                    <option value="Java">Java Concept Coding</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Concept *</label>
                  <select
                    value={newProblem.concept}
                    onChange={(e) =>
                      setNewProblem({ ...newProblem, concept: e.target.value })
                    }
                  >
                    <option value="Arrays">Arrays</option>
                    <option value="Strings">Strings</option>
                    <option value="Linked Lists">Linked Lists</option>
                    <option value="Stacks & Queues">Stacks & Queues</option>
                    <option value="Trees & BST">Trees & BST</option>
                    <option value="Binary Search">Binary Search</option>
                    <option value="Heaps">Heaps</option>
                    <option value="Graphs">Graphs</option>
                    <option value="Dynamic Programming">Dynamic Programming</option>
                    <option value="Intervals & Backtracking">Intervals & Backtracking</option>
                    <option value="Java OOP">Java OOP</option>
                    <option value="Java Collections">Java Collections</option>
                    <option value="Java Streams">Java Streams</option>
                    <option value="Java Concurrency">Java Concurrency</option>
                    <option value="Java I/O & Exceptions">Java I/O & Exceptions</option>
                    <option value="Java JVM & Memory">Java JVM & Memory</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Pattern / Method</label>
                  <input
                    type="text"
                    placeholder="e.g. Two Pointers / Kadane's"
                    value={newProblem.method}
                    onChange={(e) =>
                      setNewProblem({ ...newProblem, method: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Difficulty *</label>
                  <select
                    value={newProblem.difficulty}
                    onChange={(e) =>
                      setNewProblem({ ...newProblem, difficulty: e.target.value })
                    }
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>LeetCode Problem #</label>
                  <input
                    type="number"
                    placeholder="e.g. 560"
                    value={newProblem.leetcodeNumber}
                    onChange={(e) =>
                      setNewProblem({
                        ...newProblem,
                        leetcodeNumber: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>LeetCode / Problem URL</label>
                  <input
                    type="url"
                    placeholder="https://leetcode.com/problems/..."
                    value={newProblem.leetcodeUrl}
                    onChange={(e) =>
                      setNewProblem({ ...newProblem, leetcodeUrl: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-save"
                  disabled={addLoading}
                >
                  {addLoading ? 'Adding...' : 'Add Problem'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PracticePlayground;
