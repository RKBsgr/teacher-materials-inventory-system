
import { useState } from 'react';

export default function PreviewModal({ url, onClose }) {
  if (!url) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <iframe 
          src={url} 
          title="Preview" 
          className="preview-iframe"
          allowFullScreen
        />
        
        <div className="preview-actions">
          <a href={url} target="_blank" rel="noopener noreferrer" className="preview-btn">
            🔗 Open Fullscreen
          </a>
        </div>
      </div>
    </div>
  );
}

