
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
          <p>keanu.basagre2004@gmail.com</p>
          <a href="keanu.basagre2004@gmail.com" className="contact-link">Send Email</a>
        </div>

        <div className="contact-card">
          <div className="contact-icon">💬</div>
          <h3>Members</h3>
          <p>Basagre, Ransford Keanu C.</p>
          <p>Castro, Catherine</p>
          <p>Mañacop, Krissa Belle</p>
          <p>Roxas, Kalvin Brent</p>
          <a href="https://www.facebook.com/ransfordkeanu.basagre/" className="contact-link" target="_blank" rel="noopener">Send Message in Facebook</a>
        </div>

        <div className="contact-card">
          <div className="contact-icon">⭐</div>
          <h3>Contribute</h3>
          <p>Help improve the platform</p>
          <a href="https://github.com/RKBsgr" className="contact-link" target="_blank" rel="noopener">GitHub</a>
        </div>
      </div>
    </div>
  );
}

