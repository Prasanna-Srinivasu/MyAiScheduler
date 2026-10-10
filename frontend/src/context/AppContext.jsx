import { createContext, useContext, useState, useEffect } from 'react';

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toast, setToast] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (message, type = 'info', title = null) => {
    setToast({ message, type, title: title || (type === 'success' ? 'Success' : type === 'error' ? 'Notice' : 'Notification') });

    // If desktop notifications are permitted, pop out to the OS desktop too!
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title || 'My AI-Scheduler', {
          body: message,
          icon: '/favicon.svg',
        });
      } catch {
        // ignore browser constructor limitations
      }
    }

    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const closeToast = () => {
    setToast(null);
  };

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        sidebarOpen,
        setSidebarOpen,
        toast,
        showToast,
        closeToast,
        refreshKey,
        triggerRefresh,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
