
export default function Contact() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📞 Get in Touch</h1>
        <p>Questions? Feature requests? Let us know!</p>
      </div>

      <div className="contact-grid">
        <div className="contact-card">
          <div className="contact-icon">📧</div>
          <h3>Email</h3>
          <p>teacher.materials.inventory@example.com</p>
          <a href="mailto:teacher.materials.inventory@example.com" className="contact-link">Send Email</a>
        </div>

        <div className="contact-card">
          <div className="contact-icon">💬</div>
          <h3>Support</h3>
          <p>File issues or suggest features</p>
          <a href="https://github.com/yourusername/teacher-materials-inventory/issues" className="contact-link" target="_blank" rel="noopener">GitHub Issues</a>
        </div>

        <div className="contact-card">
          <div className="contact-icon">⭐</div>
          <h3>Contribute</h3>
          <p>Help improve the platform</p>
          <a href="https://github.com/yourusername/teacher-materials-inventory" className="contact-link" target="_blank" rel="noopener">GitHub Repo</a>
        </div>

        <div className="contact-card">
          <div className="contact-icon">📄</div>
          <h3>Docs</h3>
          <p>Setup, API docs, troubleshooting</p>
          <a href="/README.md" className="contact-link">Read Documentation</a>
        </div>
      </div>
    </div>
  );
}

