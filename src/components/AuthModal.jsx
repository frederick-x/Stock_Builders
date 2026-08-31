import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useNexora } from '../context/NexoraContext';
import NexoraLogo from './NexoraLogo';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, user, setUser, showToast, signInWithEmail, signUpWithEmail, handleGuest } = useNexora();
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (tab === 'login') {
      const res = await signInWithEmail(email.trim(), password);
      if (res?.error) {
        showToast(res.error.message || 'Login error', 'warning');
      }
    } else {
      const res = await signUpWithEmail(email.trim(), password, name.trim());
      if (res?.error) {
        showToast(res.error.message || 'Registration error', 'warning');
      }
    }
  };

  // Guest login falls back to the context helper (keeps offline demo flow)
  // mapped to Supabase only when available
  // re-use handleGuest from context
  // If supabase is configured, guest remains a local simulated account
  const handleGuestClick = () => {
    handleGuest();
    setIsAuthModalOpen(false);
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsAuthModalOpen(false)}>
      <div className="modal-card modal-auth" onClick={(e) => e.stopPropagation()}>
        <div className="auth-card-top">
          <NexoraLogo size={42} showText={true} tagline={true} />
          <button 
            type="button" 
            className="btn-modal-close"
            onClick={() => setIsAuthModalOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="auth-pill-switch">
          <button 
            type="button" 
            className={`auth-pill-btn ${tab === 'login' ? 'active' : ''}`}
            onClick={() => setTab('login')}
          >
            Sign In
          </button>
          <button 
            type="button" 
            className={`auth-pill-btn ${tab === 'register' ? 'active' : ''}`}
            onClick={() => setTab('register')}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleLogin} className="auth-form-body">
          {tab === 'register' && (
            <div className="auth-input-group">
              <label htmlFor="auth-name">Commander Name</label>
              <div className="input-icon-field">
                <User size={16} className="field-icon" />
                <input
                  id="auth-name"
                  type="text"
                  placeholder="e.g. Alex"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="auth-input"
                  required
                />
              </div>
            </div>
          )}

          <div className="auth-input-group">
            <label htmlFor="auth-email">Email Address</label>
            <div className="input-icon-field">
              <Mail size={16} className="field-icon" />
              <input
                id="auth-email"
                type="email"
                placeholder="commander@nexora.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                required
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label htmlFor="auth-pass">Password</label>
            <div className="input-icon-field">
              <Lock size={16} className="field-icon" />
              <input
                id="auth-pass"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-auth-submit">
            <span>{tab === 'login' ? 'Enter Simulation' : 'Initialize Account'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <div className="auth-secondary-actions">
          <button type="button" className="btn-google-auth" onClick={handleLogin}>
            <svg className="google-svg" viewBox="0 0 24 24" width="18" height="18">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Continue with Google
          </button>

          <button type="button" className="btn-guest-auth" onClick={handleGuestClick}>
            <Sparkles size={16} />
            Instant Guest Pilot
          </button>
        </div>

        <div className="auth-disclaimer-box">
          <ShieldCheck size={14} className="text-cyan" />
          <span>NEXORA is a 100% virtual strategy simulation. No real money or crypto involved.</span>
        </div>
      </div>
    </div>
  );
}
