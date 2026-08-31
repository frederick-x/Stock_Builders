import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { useNexora } from '../context/NexoraContext';

export default function LoginPage() {
  const { signInWithEmail, signUpWithEmail, handleGuest, showToast, simulateConfirmLocalUser } = useNexora();
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [justRegisteredEmail, setJustRegisteredEmail] = useState(null);
  const [errors, setErrors] = useState({ email: '', password: '', general: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: '', password: '', general: '' });
    if (tab === 'login') {
      const res = await signInWithEmail(email.trim(), password);
      if (res?.error) {
        const msg = res.error.message || 'Login failed';
        // Map error messages to specific fields
        if (/no account/i.test(msg) || /not found/i.test(msg)) {
          setErrors(prev => ({ ...prev, email: 'No account found with that email' }));
        } else if (/confirm/i.test(msg)) {
          setErrors(prev => ({ ...prev, general: 'Please confirm your email before signing in' }));
        } else if (/invalid|credentials/i.test(msg)) {
          setErrors(prev => ({ ...prev, password: 'Incorrect password' }));
        } else {
          setErrors(prev => ({ ...prev, general: msg }));
        }
        showToast(msg, 'warning');
      }
    } else {
      const res = await signUpWithEmail(email.trim(), password, name.trim());
      if (res?.error) {
        showToast(res.error.message || 'Sign up failed', 'warning');
      } else {
        // On successful sign-up (Supabase or local), switch to Sign In tab and prefill email for sign-in
        setTab('login');
        setJustRegisteredEmail(email.trim());
        showToast('Account created. Please sign in with your credentials.', 'info');
      }
    }
  };

  const handleGuestClick = () => {
    handleGuest();
  };

  return (
    <div className="login-page-root">
      <div className="login-card">
        <h1>NEXORA</h1>
        <p className="tagline">Let your agent do the work.</p>

        <div className="auth-pill-switch">
          <button type="button" className={`auth-pill-btn ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>Sign In</button>
          <button type="button" className={`auth-pill-btn ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>Create Account</button>
        </div>

        <form className="auth-form-body" onSubmit={handleSubmit}>
          {tab === 'register' && (
            <div className="auth-input-group">
              <label>Commander Name</label>
              <div className="input-icon-field">
                <User size={16} className="field-icon" />
                <input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            </div>
          )}

          <div className="auth-input-group">
            <label>Email Address</label>
              <div className="input-icon-field">
              <Mail size={16} className="field-icon" />
              <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }} required />
              </div>
              {errors.email && <div style={{ color: '#ef4444', marginTop: 6 }}>{errors.email}</div>}
          </div>

          <div className="auth-input-group">
            <label>Password</label>
              <div className="input-icon-field">
                <Lock size={16} className="field-icon" />
                <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })); }} required />
              </div>
              {errors.password && <div style={{ color: '#ef4444', marginTop: 6 }}>{errors.password}</div>}
          </div>

          <button type="submit" className="btn-auth-submit">
            <span>{tab === 'login' ? 'Enter Simulation' : 'Initialize Account'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="auth-secondary-actions">
          <button className="btn-guest-auth" onClick={handleGuestClick}><Sparkles size={16} /> Instant Guest Pilot</button>
          {errors.general && <div style={{ color: '#f97316', marginTop: 10 }}>{errors.general}</div>}
          {justRegisteredEmail && (
            <div style={{ marginTop: 12 }}>
              <div style={{ color: '#94a3b8', marginBottom: 6 }}>Local account created for {justRegisteredEmail}. Confirm email to sign in.</div>
              <button className="btn-auth-submit" onClick={() => {
                simulateConfirmLocalUser(justRegisteredEmail);
                setJustRegisteredEmail(null);
              }}>Simulate Email Confirmation</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
