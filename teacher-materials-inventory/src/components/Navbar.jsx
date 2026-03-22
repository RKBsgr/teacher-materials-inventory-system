import { useState } from "react";

export default function Navbar({ page, setPage, darkMode }) {
  return (
    <nav className={`navbar ${darkMode ? 'dark' : ''}`}>
      <div className="nav-container">
        <div className="nav-brand">
          <h2>📚 TMI</h2>
        </div>
        <div className="nav-links">
          <button className={page === 'home' ? 'nav-active' : ''} onClick={() => setPage('home')}>
            🏠 Home
          </button>
          <button className={page === 'about' ? 'nav-active' : ''} onClick={() => setPage('about')}>
            ℹ️ About
          </button>
          <button className={page === 'contact' ? 'nav-active' : ''} onClick={() => setPage('contact')}>
            📞 Contact
          </button>
        </div>
      </div>
    </nav>
  );
}
