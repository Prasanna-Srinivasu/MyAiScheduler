import { useState, useEffect } from 'react';
import {
  CheckSquare,
  Clock,
  Flame,
  TrendingUp,
  Sparkles,
  Plus,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useApp } from '../context/AppContext';
import taskService from '../services/taskService';
import DashboardCard from '../components/dashboard/DashboardCard';
import TodayTasks from '../components/dashboard/TodayTasks';
import UpcomingEvents from '../components/dashboard/UpcomingEvents';
import Modal from '../components/common/Modal';
import TaskForm from '../components/tasks/TaskForm';
import Loader from '../components/common/Loader';
import { formatMinutes } from '../utils/dateUtils';
import './Dashboard.css';

export function Dashboard() {
  const { user } = useAuth();
  const { refreshKey, triggerRefresh } = useApp();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await taskService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [refreshKey]);

  const handleToggleTask = async (id) => {
    try {
      await taskService.toggleTaskStatus(id);
      triggerRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (formData) => {
    setSubmitting(true);
    try {
      await taskService.createTask(formData);
      setModalOpen(false);
      triggerRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !stats) {
    return <Loader size="lg" message="Loading your dashboard..." />;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-hero-banner">
        <div className="hero-text">
          <h1 className="hero-greeting">
            Welcome to your Study Sanctuary, {user?.name || 'Scholar'}! ☕
          </h1>
          <p className="hero-subtext">
            Focus Track: <span className="highlight-pill">{user?.targetRole || 'Full Stack Developer'}</span> ({user?.experienceLevel || 'Intermediate'})
          </p>
        </div>
      </div>

      <div className="dashboard-stats-grid">
        <DashboardCard
          title="Total Tasks"
          value={stats?.totalTasks || 0}
          icon={<CheckSquare size={20} />}
          subtitle={`${stats?.pendingTasks || 0} pending`}
          color="indigo"
        />
        <DashboardCard
          title="Completed"
          value={stats?.completedTasks || 0}
          icon={<TrendingUp size={20} />}
          subtitle={`${stats?.completionRate || 0}% completion rate`}
          color="green"
        />
        <DashboardCard
          title="Daily Study Streak"
          value={`${stats?.studyStreakDays || 0} Days`}
          icon={<Flame size={20} />}
          subtitle="Consistency is key"
          color="amber"
        />
        <DashboardCard
          title="Today's Study Load"
          value={formatMinutes(stats?.totalPlannedMinutesToday || 0)}
          icon={<Clock size={20} />}
          subtitle={`${formatMinutes(stats?.completedMinutesToday || 0)} accomplished`}
          color="purple"
        />
      </div>

      <div className="dashboard-main-grid">
        <div className="main-grid-left">
          <TodayTasks
            tasks={stats?.todayTasks || []}
            onToggle={handleToggleTask}
            onAddNew={() => setModalOpen(true)}
          />
        </div>
        <div className="main-grid-right">
          <UpcomingEvents tasks={stats?.upcomingTasks || []} />
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Learning Task"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setModalOpen(false)}
          loading={submitting}
        />
      </Modal>
    </div>
  );
}

export default Dashboard;
