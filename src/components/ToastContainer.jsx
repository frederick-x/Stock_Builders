import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useNexora } from '../context/NexoraContext';

export default function ToastContainer() {
  const { activeToast } = useNexora();
  if (!activeToast) return null;

  const icons = {
    success: <CheckCircle2 size={16} className="text-emerald" />,
    warning: <AlertCircle size={16} className="text-gold" />,
    error: <AlertCircle size={16} className="text-pink" />,
    info: <Sparkles size={16} className="text-cyan" />,
  };

  return (
    <div className="toast-fixed-container">
      <div className={`toast-card toast-${activeToast.type || 'info'}`}>
        {icons[activeToast.type] || icons.info}
        <span className="toast-text">{activeToast.message}</span>
      </div>
    </div>
  );
}
