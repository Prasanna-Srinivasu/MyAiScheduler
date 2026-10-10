import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Lock, LogIn, Flame, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { validateEmail } from '../utils/validation';
import './Login.css';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(''); // 'GOOGLE' | 'GITHUB' | ''

  const { user, isAuthenticated, login, googleLogin } = useAuth();
  const navigate = useNavigate();

  // If user already has an active session, redirect straight to LeetCode practice playground
  useEffect(() => {
    if (isAuthenticated || user) {
      navigate('/practice', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email || !validateEmail(email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setFormError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/practice', { replace: true });
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
        'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Official Google OAuth 2.0 Account Picker for any user
  const handleGoogleClick = () => {
    setFormError('');
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!googleClientId) {
      setFormError('Google OAuth is being configured by the system administrator. In the meantime, please sign in or register with email below.');
      return;
    }

    // Google Identity Services OAuth 2.0 Token Client (Opens official Google Account Chooser)
    if (window.google?.accounts?.oauth2) {
      setSocialLoading('GOOGLE');
      try {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'openid email profile',
          prompt: 'select_account',
          callback: async (tokenResponse) => {
            if (tokenResponse && tokenResponse.access_token) {
              try {
                await googleLogin({ accessToken: tokenResponse.access_token });
                navigate('/practice', { replace: true });
              } catch (err) {
                setFormError(err.response?.data?.message || 'Google OAuth verification failed on server.');
              } finally {
                setSocialLoading('');
              }
            } else if (tokenResponse && tokenResponse.error) {
              setSocialLoading('');
              if (tokenResponse.error !== 'popup_closed_by_user') {
                setFormError(`Google sign-in error: ${tokenResponse.error}`);
              }
            }
          },
          error_callback: (err) => {
            setSocialLoading('');
            console.error('Google OAuth popup error:', err);
            setFormError('Google Sign-In popup was closed or blocked.');
          },
        });

        tokenClient.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (err) {
        setSocialLoading('');
        console.error('Failed to launch Google Token Client:', err);
      }
    }

    // Fallback: Google One Tap / GIS ID token prompt
    if (window.google?.accounts?.id) {
      setSocialLoading('GOOGLE');
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response) => {
            if (response && response.credential) {
              try {
                await googleLogin({ credential: response.credential });
                navigate('/practice', { replace: true });
              } catch (err) {
                setFormError(err.response?.data?.message || 'Google ID verification failed.');
              } finally {
                setSocialLoading('');
              }
            }
          },
        });
        window.google.accounts.id.prompt();
        return;
      } catch (err) {
        setSocialLoading('');
      }
    }

    // Fallback: Official Google Web OAuth Redirect
    const redirectUri = `${window.location.origin}/auth/callback/google`;
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=openid%20email%20profile&prompt=select_account`;
  };

  // Official GitHub OAuth Authorization Page for any user
  const handleGitHubClick = () => {
    setFormError('');
    const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID;

    if (!githubClientId) {
      setFormError('GitHub OAuth is being configured by the system administrator. In the meantime, please sign in or register with email below.');
      return;
    }

    const redirectUri = `${window.location.origin}/auth/callback/github`;
    const state = Math.random().toString(36).substring(7);
    sessionStorage.setItem('oauth_state', state);

    // Redirect straight to GitHub official OAuth authorization page
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user%20user:email&state=${state}`;
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-brand-header">
          <div className="study-lamp-badge">
            <BookOpen size={28} />
          </div>
          <div className="study-streak-chip">
            <Flame size={14} className="streak-icon" />
            <span>Study Sanctuary • Focus &amp; Plan</span>
          </div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">
            Sign in to continue your AI-guided developer learning schedule.
          </p>
        </div>

        {formError && <div className="auth-alert-error">{formError}</div>}

        {/* Real Social Authentication Buttons */}
        <div className="social-login-group">
          <button
            type="button"
            className="social-auth-btn google-btn"
            onClick={handleGoogleClick}
            disabled={loading || !!socialLoading}
            id="google-signin-btn"
          >
            {socialLoading === 'GOOGLE' ? (
              <div className="btn-spinner" />
            ) : (
              <svg className="social-icon" viewBox="0 0 24 24" width="20" height="20">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>{socialLoading === 'GOOGLE' ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>

          <button
            type="button"
            className="social-auth-btn github-btn"
            onClick={handleGitHubClick}
            disabled={loading || !!socialLoading}
          >
            {socialLoading === 'GITHUB' ? (
              <div className="btn-spinner" />
            ) : (
              <svg className="social-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            )}
            <span>{socialLoading === 'GITHUB' ? 'Redirecting to GitHub...' : 'Continue with GitHub'}</span>
          </button>
        </div>

        <div className="auth-separator">
          <span className="separator-line"></span>
          <span className="separator-text">or continue with email</span>
          <span className="separator-line"></span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            icon={<Mail size={16} />}
            error={errors.email}
            required
          />

          <div className="password-input-wrapper">
            <div className="password-label-row">
              <label className="input-label">Password</label>
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot password?
              </Link>
            </div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={<Lock size={16} />}
              error={errors.password}
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            icon={<LogIn size={18} />}
            className="auth-submit-btn"
          >
            Sign In to Study Sanctuary
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-switch-link">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
