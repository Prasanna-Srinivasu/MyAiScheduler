import { useState, useEffect } from 'react';
import { User, Mail, Award, Briefcase, Save } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useApp } from '../context/AppContext';
import authService from '../services/authService';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { TARGET_ROLES, EXPERIENCE_LEVELS } from '../utils/constants';
import './ProfilePage.css';

export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { showToast } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    targetRole: TARGET_ROLES[0],
    experienceLevel: 'Intermediate',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        targetRole: user.targetRole || TARGET_ROLES[0],
        experienceLevel: user.experienceLevel || 'Intermediate',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await authService.updateProfile({
        name: formData.name,
        targetRole: formData.targetRole,
        experienceLevel: formData.experienceLevel,
      });
      updateUser(updated);
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page-container">
      <div className="profile-header">
        <h2 className="page-heading">Developer Profile</h2>
        <p className="page-subheading">
          Manage your role aspirations and career progression parameters used by the AI engine.
        </p>
      </div>

      <div className="profile-grid">
        <div className="profile-avatar-card">
          <div className="large-avatar">
            {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <h3 className="profile-display-name">{formData.name}</h3>
          <span className="profile-display-role">{formData.targetRole}</span>
          <div className="experience-badge">{formData.experienceLevel} Level</div>
        </div>

        <div className="profile-form-card">
          <form onSubmit={handleSubmit} className="profile-form">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              icon={<User size={16} />}
              required
            />

            <Input
              label="Email Address"
              name="email"
              value={formData.email}
              icon={<Mail size={16} />}
              disabled
              helperText="Email cannot be changed."
            />

            <div className="profile-row">
              <Input
                label="Target Role"
                name="targetRole"
                as="select"
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                icon={<Briefcase size={16} />}
              >
                {TARGET_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </Input>

              <Input
                label="Current Experience Level"
                name="experienceLevel"
                as="select"
                value={formData.experienceLevel}
                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                icon={<Award size={16} />}
              >
                {EXPERIENCE_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </Input>
            </div>

            <div className="profile-actions">
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                icon={<Save size={16} />}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
