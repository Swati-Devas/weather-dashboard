import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, LogOut, ChevronDown, CheckCircle, ShieldCheck, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function UserProfileMenu() {
  const { user, logout, openLoginModal } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // When logged out, show the sleek "Sign In" button in header
  if (!user) {
    return (
      <button
        type="button"
        className="header-signin-btn"
        onClick={openLoginModal}
        aria-label="Sign in with Google to unlock forecasts"
      >
        <User size={15} />
        <span>Sign In</span>
      </button>
    );
  }

  // When logged in, render Google profile picture, display name, and dropdown
  const displayName = user.displayName || 'Google User';
  const email = user.email || '';
  const photoURL = user.photoURL;

  return (
    <div className="user-menu-container" ref={menuRef}>
      {/* Profile Trigger Button in Header */}
      <button
        type="button"
        className="user-profile-trigger"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
        aria-label="User account menu"
      >
        {photoURL ? (
          <img
            src={photoURL}
            alt={displayName}
            className="user-avatar-img"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="user-avatar-fallback">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="user-display-name">{displayName}</span>
        <ChevronDown size={14} className={`dropdown-caret ${isDropdownOpen ? 'open' : ''}`} />
      </button>

      {/* Profile Dropdown Menu */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            className="user-dropdown-menu card"
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            role="menu"
          >
            <div className="dropdown-user-header">
              <p className="dropdown-user-name">{displayName}</p>
              <p className="dropdown-user-email">{email}</p>
            </div>

            <div className="dropdown-divider" />

            <button
              type="button"
              className="dropdown-menu-item"
              onClick={() => {
                setIsDropdownOpen(false);
                setShowAccountModal(true);
              }}
              role="menuitem"
            >
              <User size={15} className="dropdown-item-icon" />
              <span>My Account</span>
            </button>

            <button
              type="button"
              className="dropdown-menu-item dropdown-logout-item"
              onClick={() => {
                setIsDropdownOpen(false);
                logout();
              }}
              role="menuitem"
            >
              <LogOut size={15} className="dropdown-item-icon" />
              <span>Sign Out</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* "My Account" Modal Dialog */}
      <AnimatePresence>
        {showAccountModal && (
          <div
            className="account-modal-overlay"
            onClick={() => setShowAccountModal(false)}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              className="account-modal-card card"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ duration: 0.22 }}
            >
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowAccountModal(false)}
                aria-label="Close profile modal"
              >
                <X size={18} />
              </button>

              <div className="account-modal-header">
                <div className="account-avatar-large">
                  {photoURL ? (
                    <img
                      src={photoURL}
                      alt={displayName}
                      className="avatar-img-lg"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="avatar-fallback-lg">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="account-verified-check" title="Verified Account">
                    <CheckCircle size={14} />
                  </span>
                </div>

                <h3 className="account-title">{displayName}</h3>
                <p className="account-email">{email}</p>
              </div>

              <div className="account-details-list">
                <div className="account-detail-row">
                  <span className="account-label">Authentication Provider</span>
                  <span className="account-val provider-badge">
                    <ShieldCheck size={14} className="provider-icon" /> Google
                  </span>
                </div>

                <div className="account-detail-row">
                  <span className="account-label">Forecast Access</span>
                  <span className="account-val status-unlocked">
                    ✓ Unlocked (Full Access)
                  </span>
                </div>
              </div>

              <div className="account-modal-actions">
                <button
                  type="button"
                  className="account-signout-btn"
                  onClick={() => {
                    setShowAccountModal(false);
                    logout();
                  }}
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

