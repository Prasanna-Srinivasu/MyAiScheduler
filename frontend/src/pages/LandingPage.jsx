import { Link } from 'react-router-dom';
import {
  BookOpen,
  Zap,
  Calendar,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  Clock,
  ArrowRight,
  Flame,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import './LandingPage.css';

export function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing-page-root">
      {/* Public Navigation */}
      <header className="landing-navbar">
        <div className="landing-brand">
          <div className="landing-logo-icon">
            <BookOpen size={22} />
          </div>
          <div className="landing-brand-text">
            <span className="brand-title">My AI-Scheduler</span>
            <span className="brand-sub">Study Sanctuary &amp; Dev Planner</span>
          </div>
        </div>

        <nav className="landing-nav-links">
          <a href="#features" className="nav-anchor">Study Features</a>
          <a href="#how-it-works" className="nav-anchor">How It Works</a>
          <a href="#value" className="nav-anchor">Study World Benefits</a>
        </nav>

        <div className="landing-nav-cta">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button variant="primary" icon={<ArrowRight size={16} />}>
                Go to Study Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login" className="login-link">
                Sign In
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Join Study Sanctuary
                </Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-badge">
          <Flame size={14} className="hero-flame" />
          <span>Study World Edition • Focus &amp; Knowledge Sanctuary</span>
        </div>
        <h1 className="hero-headline">
          Master Coding &amp; Academics. <br />
          <span className="gradient-text">In Your Personal AI Study Sanctuary.</span>
        </h1>
        <p className="hero-description">
          A calm, intelligent study world that aligns developer tracks and study sessions with your daily
          mental energy, available hours, and career aspirations. Built for engineers and scholars mastering
          Java, React, Algorithms, and System Architecture.
        </p>

        <div className="hero-cta-group">
          <Link to="/register">
            <Button variant="primary" size="lg" icon={<Sparkles size={18} />}>
              Start Daily Study Routine
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="lg">
              Sign In with Google / GitHub
            </Button>
          </Link>
        </div>

        {/* Feature Highlights Banner */}
        <div className="hero-stats-strip">
          <div className="strip-item">
            <Flame className="strip-icon amber" size={20} />
            <span>Unbroken Daily Study Streaks</span>
          </div>
          <div className="strip-item">
            <Zap className="strip-icon green" size={20} />
            <span>Energy-Adaptive Focus Blocks</span>
          </div>
          <div className="strip-item">
            <GraduationCap className="strip-icon blue" size={20} />
            <span>Curriculum &amp; Role Mastery</span>
          </div>
        </div>
      </section>

      {/* What Will It Give You Section */}
      <section id="value" className="landing-section value-section">
        <div className="section-header">
          <span className="section-eyebrow">Study World Advantage</span>
          <h2 className="section-title">What Will This Study Sanctuary Give You?</h2>
          <p className="section-subtitle">
            Traditional task lists don't account for mental fatigue or deep learning curves.
            My AI-Scheduler crafts an optimal study routine tailored to your day.
          </p>
        </div>

        <div className="value-cards-grid">
          <div className="value-card">
            <div className="value-icon-box icon-amber">
              <Zap size={24} />
            </div>
            <h3>1. Energy-Aware Study Sessions</h3>
            <p>
              Tired after lectures or work? Switch to <strong>Low Energy Mode</strong> for light revision,
              architecture reading, and conceptual summaries. Feeling energized? Engage <strong>Deep Focus Mode</strong> for
              algorithmic sprints and coding challenges.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon-box icon-emerald">
              <GraduationCap size={24} />
            </div>
            <h3>2. Role &amp; Academic Roadmaps</h3>
            <p>
              Select your goal — <em>Full Stack Developer, Java Backend Engineer, or Machine Learning Scholar</em>.
              The AI breaks down high-level roadmaps into actionable 30–60 minute milestone cards.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon-box icon-blue">
              <MessageSquare size={24} />
            </div>
            <h3>3. On-Demand AI Study Mentor</h3>
            <p>
              Encounter a difficult concept like <em>"Spring Security Filters"</em> or <em>"React 19 Server Actions"</em>?
              Ask your built-in AI Study Mentor for instant analogies, code blueprints, and tailored step-by-step guidance.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon-box icon-gold">
              <TrendingUp size={24} />
            </div>
            <h3>4. Study Streak &amp; Momentum Tracker</h3>
            <p>
              Track your focus hours, completed study topics, and uninterrupted daily streaks.
              Watch your progress compound day after day with zero overwhelm.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="landing-section steps-section">
        <div className="section-header">
          <span className="section-eyebrow">Daily Flow</span>
          <h2 className="section-title">How It Works in 3 Simple Steps</h2>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h4>Input Energy &amp; Available Hours</h4>
            <p>State how many study hours you have today (e.g. 2h or 4.5h) and select your focus capacity (High, Medium, or Low).</p>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h4>AI Generates Your Timetable</h4>
            <p>AI calculates estimated minutes, assigns study categories (Study, Coding, Revision), and balances break intervals.</p>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h4>Focus, Check Off &amp; Progress</h4>
            <p>Mark topics completed with one click, view your monthly study calendar, and keep your study streak blazing.</p>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="landing-cta-banner">
        <div className="cta-content">
          <h2>Ready to Enter Your Study Sanctuary?</h2>
          <p>
            Join developers and students organizing their learning schedules with AI precision.
          </p>
          <div className="cta-buttons">
            <Link to="/register">
              <Button variant="primary" size="lg" icon={<Sparkles size={18} />}>
                Create Your Free Study Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <BookOpen size={18} className="footer-icon" />
            <span>My AI-Scheduler — Your Academic &amp; Developer Study Sanctuary</span>
          </div>
          <p className="footer-copyright">
            Built with Spring Boot 4, React 19, and MySQL. Study World Edition.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
