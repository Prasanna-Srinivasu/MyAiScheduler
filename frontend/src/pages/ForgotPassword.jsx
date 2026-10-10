import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, Mail, Lock, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import authService from '../services/authService';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { validateEmail, validatePassword } from '../utils/validation';
import './ForgotPassword.css';

export function ForgotPassword() {
  const [step, setStep] = useState(1); // 1 = Enter Email, 2 = Enter Code & New Password, 3 = Success
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const navigate = useNavigate();

  const handleRequestCode = async (e) => {
    e.preventDefault();
    if (!email || !validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await authService.forgotPassword(email);
      setGeneratedCode(response.resetCode || '');
      setResetCode(response.resetCode || '');
      setInfoMessage('Verification code generated successfully! Enter your code and new password below.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request password reset code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetCode.trim()) {
      setError('Please enter the 6-digit verification code.');
      return;
    }
    if (!validatePassword(newPassword)) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await authService.resetPassword({
        email,
        resetCode: resetCode.trim(),
        newPassword,
      });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please verify the code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card forgot-password-card">
        <div className="auth-brand-header">
          <div className="study-lamp-badge">
            <KeyRound size={28} />
          </div>
          <h2 className="auth-title">
            {step === 3 ? 'Password Reset!' : 'Reset Password'}
          </h2>
          <p className="auth-subtitle">
            {step === 1 && 'Enter your registered email address to receive a verification code.'}
            {step === 2 && 'Enter the verification code and set your new account password.'}
            {step === 3 && 'Your password has been reset successfully. You can now sign in.'}
          </p>
        </div>

        {error && <div className="auth-alert-error">{error}</div>}

        {step === 1 && (
          <form onSubmit={handleRequestCode} className="auth-form">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              icon={<Mail size={16} />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="auth-submit-btn"
            >
              Send Verification Code
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="auth-form">
            {generatedCode && (
              <div className="verification-code-banner">
                <ShieldCheck size={18} className="code-banner-icon" />
                <div className="code-banner-text">
                  <span>Verification Code: <strong>{generatedCode}</strong></span>
                  <p>In dev mode, code is provided directly for instant reset.</p>
                </div>
              </div>
            )}

            <Input
              label="6-Digit Verification Code"
              type="text"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              placeholder="e.g. 849201"
              required
            />

            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 6 characters"
              icon={<Lock size={16} />}
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              icon={<Lock size={16} />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="auth-submit-btn"
            >
              Reset Password
            </Button>
          </form>
        )}

        {step === 3 && (
          <div className="reset-success-box">
            <CheckCircle2 size={54} className="success-icon" />
            <p className="success-text">Your password has been updated. You're ready to continue learning!</p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/login')}
              className="auth-submit-btn"
            >
              Proceed to Sign In
            </Button>
          </div>
        )}

        <div className="auth-footer">
          <Link to="/login" className="back-to-login-link">
            <ArrowLeft size={16} />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
