import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, Bell, X } from 'lucide-react';
import './MainLayout.css';

export function MainLayout() {
  const { toast, closeToast } = useApp();

  return (
    <div className="layout-root">
      <Sidebar />
      <div className="layout-main-wrapper">
        <Navbar />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>

      {/* Floating Animated Toast Popout */}
      {toast && (
        <div className={`app-toast toast-${toast.type}`}>
          <div className="toast-icon-box">
            {toast.type === 'success' && <CheckCircle2 size={18} />}
            {toast.type === 'error' && <AlertCircle size={18} />}
            {toast.type !== 'success' && toast.type !== 'error' && <Bell size={18} />}
          </div>
          <div className="toast-content-col">
            <span className="toast-title">{toast.title}</span>
            <span className="toast-message">{toast.message}</span>
          </div>
          <button className="toast-close-btn" onClick={closeToast} aria-label="Dismiss notification">
            <X size={14} />
          </button>
          <div className="toast-progress-bar" />
        </div>
      )}
    </div>
  );
}

export default MainLayout;
