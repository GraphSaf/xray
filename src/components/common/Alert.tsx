import React from 'react';

interface AlertProps {
  type: 'info' | 'success' | 'warning' | 'error';
  children: React.ReactNode;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, children, onClose }) => {
  const styles = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    error: 'bg-red-50 text-red-800 border-red-200'
  };

  const icons = {
    info: 'ℹ️',
    success: '✓',
    warning: '⚠️',
    error: '✕'
  };

  return (
    <div className={`border rounded-md p-4 ${styles[type]} flex items-start gap-3`} role="alert">
      <span className="text-xl flex-shrink-0">{icons[type]}</span>
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-xl hover:opacity-70 transition-opacity"
          aria-label="Закрыть"
        >
          ×
        </button>
      )}
    </div>
  );
};
