import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bell, Moon, Sun, Clock, Save } from 'lucide-react';
import { useApp } from '../context/AppContext';
import authService from '../services/authService';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import './SettingsPage.css';

export function SettingsPage() {
  const { theme, toggleTheme, showToast } = useApp();

  const [settings, setSettings] = useState({
    preferredStudyIntensity: 'MODERATE',
    wakeUpTime: '07:00',
    sleepTime: '23:00',
    notificationEnabled: true,
    dailySummaryEnabled: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const data = await authService.getPreferences();
        if (data) {
          setSettings({
            preferredStudyIntensity: data.preferredStudyIntensity || 'MODERATE',
            wakeUpTime: data.wakeUpTime || '07:00',
            sleepTime: data.sleepTime || '23:00',
            notificationEnabled: data.notificationEnabled !== false,
            dailySummaryEnabled: data.dailySummaryEnabled !== false,
          });
        }
      } catch (err) {
        console.error('Failed to load preferences:', err);
      }
    };
    fetchPrefs();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.updateProfile({
        preferredStudyIntensity: settings.preferredStudyIntensity,
        wakeUpTime: settings.wakeUpTime,
        sleepTime: settings.sleepTime,
        notificationEnabled: settings.notificationEnabled,
        dailySummaryEnabled: settings.dailySummaryEnabled,
      });
      showToast('Settings saved successfully!', 'success');
    } catch (err) {
      showToast('Failed to save settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page-container">
      <div className="settings-header">
        <h2 className="page-heading">Application Settings</h2>
        <p className="page-subheading">
          Configure daily schedules, study intensity, routine hours, and notifications.
        </p>
      </div>

      <form onSubmit={handleSave} className="settings-form">
        <div className="settings-section-card">
          <h3 className="section-title">Study Rhythm & Intensity</h3>
          <p className="section-desc">
            Controls how aggressively the AI algorithm structures study tasks and durations.
          </p>

          <Input
            label="Preferred Study Intensity"
            as="select"
            value={settings.preferredStudyIntensity}
            onChange={(e) =>
              setSettings({ ...settings, preferredStudyIntensity: e.target.value })
            }
          >
            <option value="LIGHT">Light (1-2 hours / day — balanced pace)</option>
            <option value="MODERATE">Moderate (3-5 hours / day — recommended)</option>
            <option value="INTENSIVE">Intensive (6+ hours / day — boot-camp pace)</option>
          </Input>

          <div className="settings-row">
            <Input
              label="Typical Wake-up Time"
              type="time"
              value={settings.wakeUpTime}
              onChange={(e) => setSettings({ ...settings, wakeUpTime: e.target.value })}
              icon={<Clock size={16} />}
            />
            <Input
              label="Typical Bedtime"
              type="time"
              value={settings.sleepTime}
              onChange={(e) => setSettings({ ...settings, sleepTime: e.target.value })}
              icon={<Clock size={16} />}
            />
          </div>
        </div>

        <div className="settings-section-card">
          <h3 className="section-title">Notification Preferences</h3>
          <div className="checkbox-toggle-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.notificationEnabled}
                onChange={(e) =>
                  setSettings({ ...settings, notificationEnabled: e.target.checked })
                }
                className="custom-checkbox"
              />
              <span className="checkbox-text">Enable in-app study reminders and task alerts</span>
            </label>
          </div>

          <div className="checkbox-toggle-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.dailySummaryEnabled}
                onChange={(e) =>
                  setSettings({ ...settings, dailySummaryEnabled: e.target.checked })
                }
                className="custom-checkbox"
              />
              <span className="checkbox-text">Daily AI summary and streak notifications</span>
            </label>
          </div>
        </div>

        <div className="settings-section-card">
          <h3 className="section-title">Interface Theme</h3>
          <div className="theme-toggle-strip">
            <span className="theme-status-text">
              Current Mode: <strong>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</strong>
            </span>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              onClick={toggleTheme}
            >
              Toggle to {theme === 'dark' ? 'Light' : 'Dark'}
            </Button>
          </div>
        </div>

        <div className="settings-submit-strip">
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            icon={<Save size={16} />}
          >
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}

export default SettingsPage;
