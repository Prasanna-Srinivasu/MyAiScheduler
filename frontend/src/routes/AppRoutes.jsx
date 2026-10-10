import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import Dashboard from '../pages/Dashboard';
import TasksPage from '../pages/TasksPage';
import AiSchedulerPage from '../pages/AiSchedulerPage';
import CalendarPage from '../pages/CalendarPage';
import NotificationsPage from '../pages/NotificationsPage';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';
import PracticePlayground from '../pages/PracticePlayground';
import CoursesPage from '../pages/CoursesPage';
import RoadmapsPage from '../pages/RoadmapsPage';
import RoadmapChatPage from '../pages/RoadmapChatPage';
import OAuthCallback from '../pages/OAuthCallback';
import NotFound from '../pages/NotFound';
import './AppRoutes.css';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Landing & Auth routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/callback/github" element={<OAuthCallback provider="GITHUB" />} />
      <Route path="/auth/callback/google" element={<OAuthCallback provider="GOOGLE" />} />

      {/* Protected routes wrapped in MainLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/practice" element={<PracticePlayground />} />
          <Route path="/roadmap-chat" element={<RoadmapChatPage />} />
          <Route path="/roadmap-chat/:trackId" element={<RoadmapChatPage />} />
          <Route path="/roadmaps" element={<RoadmapChatPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/ai-scheduler" element={<AiSchedulerPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
