import { useState } from 'react';
import { Compass, BookOpen, Code2, Layers, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import RoadmapFlowchart from '../components/roadmap/RoadmapFlowchart';
import './RoadmapsPage.css';

export function RoadmapsPage() {
  const [selectedTrack, setSelectedTrack] = useState('java');

  return (
    <div className="roadmaps-page-container">
      {/* Header */}
      <div className="roadmaps-page-header">
        <div className="roadmaps-header-info">
          <div className="roadmaps-badge">
            <Compass size={18} />
            <span>Interactive Visual Flowchart</span>
          </div>
          <h1>Developer Learning Flowcharts</h1>
          <p>
            CodeCamp-style sequential visual flowcharts for 3-Year Java Backend, Frontend React, and Full Stack engineers.
            Step-by-step sequential mastery with direct AI scheduling.
          </p>
        </div>

        <div className="roadmaps-header-links">
          <Link to="/practice" className="roadmap-action-link practice-link">
            <Code2 size={16} />
            <span>LeetCode Playground (110 Problems)</span>
          </Link>
          <Link to="/courses" className="roadmap-action-link courses-link">
            <BookOpen size={16} />
            <span>Course Library</span>
          </Link>
        </div>
      </div>

      {/* Track Selector Bar */}
      <div className="track-selector-bar">
        <button
          type="button"
          className={`track-btn ${selectedTrack === 'java' ? 'active' : ''}`}
          onClick={() => setSelectedTrack('java')}
        >
          <Layers size={16} />
          <span>Core Java &amp; Spring Boot Path</span>
        </button>

        <button
          type="button"
          className={`track-btn ${selectedTrack === 'frontend' ? 'active' : ''}`}
          onClick={() => setSelectedTrack('frontend')}
        >
          <Code2 size={16} />
          <span>Modern React &amp; Frontend Path</span>
        </button>

        <button
          type="button"
          className={`track-btn ${selectedTrack === 'fullstack' ? 'active' : ''}`}
          onClick={() => setSelectedTrack('fullstack')}
        >
          <Award size={16} />
          <span>Full Stack Enterprise Architect Path</span>
        </button>
      </div>

      {/* Flowchart Component */}
      <div className="roadmap-flowchart-section">
        <RoadmapFlowchart trackId={selectedTrack} />
      </div>
    </div>
  );
}

export default RoadmapsPage;
