// src/components/common/LoadingSpinner.tsx
import React from 'react';
// CSS for this will be in src/index.css

const LoadingSpinner: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <div className="loading-spinner-overlay">
      <div className="loading-spinner"></div>
      {text && <p className="loading-spinner-text">{text}</p>}
    </div>
  );
};
export default LoadingSpinner; 