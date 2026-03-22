
import { useState } from "react";

export default function Navbar({ page, setPage, darkMode }) {
  return (
    <nav className={`navbar ${darkMode ? 'dark' : ''}`}>
      <div className="nav-container">
        <div className="nav-links">
          <button 
            className={page === 'home' ? 'nav-active' : ''} 
onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Home
            </button>
            <button 
              className={page === 'about' ? 'nav-active' : ''} 
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              About
            </button>
          <button 
            className={page === 'contact' ? 'nav-active' : ''} 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Contact
          </button>
        </div>

      </div>
    </nav>
  );
}

