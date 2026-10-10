import { useState } from 'react';
import { KeyRound, Copy, Check, ExternalLink, ShieldCheck, X } from 'lucide-react';
import { Button } from '../common/Button';
import './OAuthSetupModal.css';

export function OAuthSetupModal({ isOpen, onClose, provider }) {
  const isGoogle = provider === 'GOOGLE';
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const envSnippet = isGoogle
    ? `VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com`
    : `VITE_GITHUB_CLIENT_ID=your-github-client-id`;

  const handleCopy = () => {
    navigator.clipboard.writeText(envSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="oauth-setup-overlay" onClick={onClose}>
      <div className="oauth-setup-card" onClick={(e) => e.stopPropagation()}>
        {/* Header Badge */}
        <div className="oauth-setup-header">
          <div className={`oauth-brand-icon-box ${isGoogle ? 'google-box' : 'github-box'}`}>
            {isGoogle ? (
              <svg viewBox="0 0 24 24" width="30" height="30">
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
            ) : (
              <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            )}
          </div>
          <h3 className="oauth-setup-title">
            {isGoogle ? 'Google OAuth Not Configured' : 'GitHub OAuth Not Configured'}
          </h3>
          <p className="oauth-setup-subtitle">
            To use official {isGoogle ? 'Google' : 'GitHub'} authentication, configure your developer Client ID.
          </p>
        </div>

        {/* Content Body */}
        <div className="oauth-setup-body">
          <div className="oauth-instructions-box">
            <h4 className="instructions-heading">Setup Instructions:</h4>
            <ol className="instructions-list">
              {isGoogle ? (
                <>
                  <li>
                    Open{' '}
                    <a
                      href="https://console.cloud.google.com/apis/credentials"
                      target="_blank"
                      rel="noreferrer"
                      className="external-link"
                    >
                      Google Cloud Console Credentials <ExternalLink size={12} />
                    </a>
                  </li>
                  <li>
                    Create an <strong>OAuth 2.0 Client ID</strong> (Application type: <em>Web application</em>).
                  </li>
                  <li>
                    Set Authorized JavaScript origins to: <code>http://localhost:5173</code>
                  </li>
                  <li>
                    Paste your Client ID into <code>frontend/.env</code>:
                  </li>
                </>
              ) : (
                <>
                  <li>
                    Open{' '}
                    <a
                      href="https://github.com/settings/developers"
                      target="_blank"
                      rel="noreferrer"
                      className="external-link"
                    >
                      GitHub Developer Settings <ExternalLink size={12} />
                    </a>
                  </li>
                  <li>
                    Register a new <strong>OAuth App</strong> (Homepage: <code>http://localhost:5173</code>).
                  </li>
                  <li>
                    Set Authorization callback URL: <code>http://localhost:5173/auth/callback/github</code>
                  </li>
                  <li>
                    Paste your Client ID into <code>frontend/.env</code>:
                  </li>
                </>
              )}
            </ol>
          </div>

          {/* Code snippet block */}
          <div className="snippet-container">
            <div className="snippet-header">
              <span>frontend/.env</span>
              <button
                type="button"
                className="copy-btn"
                onClick={handleCopy}
                aria-label="Copy environment variable snippet"
              >
                {copied ? <Check size={14} className="copied-icon" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="snippet-code">
              <code>{envSnippet}</code>
            </pre>
          </div>

          <div className="oauth-security-note">
            <ShieldCheck size={16} className="note-icon" />
            <span>
              Real OAuth authenticates directly against verified {isGoogle ? 'Google' : 'GitHub'} servers.
              Tokens are never accepted through manual email input.
            </span>
          </div>

          <div className="oauth-setup-actions">
            <Button variant="primary" size="md" onClick={onClose} className="setup-close-btn">
              Got It
            </Button>
          </div>
        </div>

        <button className="oauth-setup-modal-close" onClick={onClose} aria-label="Close dialog">
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

export default OAuthSetupModal;
