import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginModal() {
  const {
    isLoginModalOpen,
    closeLoginModal,
    loginWithGoogle,
    isAuthenticating,
    authError,
    clearAuthError,
  } = useAuth();

  if (!isLoginModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="login-modal-overlay" onClick={closeLoginModal} role="dialog" aria-modal="true">
        <motion.div
          className="login-modal-card card"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {/* Close button */}
          <button
            type="button"
            className="modal-close-btn"
            onClick={closeLoginModal}
            aria-label="Close login dialog"
          >
            <X size={18} />
          </button>

          {/* Modal Header & Icon */}
          <div className="login-modal-header">
            <div className="login-icon-badge" aria-hidden="true">
              <Lock size={26} className="login-badge-lock" />
              <Sparkles size={14} className="login-badge-sparkle" />
            </div>

            <h2 className="login-modal-title">Unlock Your Weather Forecast</h2>
            <p className="login-modal-subtitle">
              Sign in with Google to explore upcoming weather forecasts and plan your days ahead.
            </p>
          </div>

          {/* Feature Highlights List */}
          <div className="login-features-list" aria-hidden="true">
            <div className="login-feature-item">
              <span className="feature-check">✓</span>
              <span>24-Hour detailed hourly timeline</span>
            </div>
            <div className="login-feature-item">
              <span className="feature-check">✓</span>
              <span>7-Day extended daily outlook</span>
            </div>
            <div className="login-feature-item">
              <span className="feature-check">✓</span>
              <span>Visual temperature & rain probability trends</span>
            </div>
          </div>

          {/* Error Message */}
          {authError && (
            <motion.div
              className="login-error-banner"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle size={16} className="login-error-icon" />
              <p className="login-error-text">{authError}</p>
            </motion.div>
          )}

          {/* Continue with Google Button */}
          <div className="login-modal-actions">
            <button
              type="button"
              className="google-signin-btn"
              onClick={loginWithGoogle}
              disabled={isAuthenticating}
              aria-label="Continue with Google"
            >
              {isAuthenticating ? (
                <>
                  <Loader2 size={18} className="spin-animation" />
                  <span>Connecting to Google...</span>
                </>
              ) : (
                <>
                  {/* Official Google Vector Logo */}
                  <svg className="google-icon-svg" viewBox="0 0 24 24" width="20" height="20">
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
                  <span>Continue with Google</span>
                </>
              )}
            </button>
          </div>

          <p className="login-privacy-note">
            Free and secure authentication via Google & Firebase.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

