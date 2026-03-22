
export default function Contact() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📞 Contact Us</h1>
        <p>Get in touch for support or feedback</p>
      </div>

      <div className="contact-grid">
        <div className="contact-card">
          <div className="contact-icon">📧</div>
          <h3>Email</h3>
          <p>support@teachermaterials.com</p>
          <a href="mailto:support@teachermaterials.com" className="contact-link">Send Email</a>
        </div>

        <div className="contact-card">
          <div className="contact-icon">💬</div>
          <h3>Discord</h3>
          <p>Teacher Materials Server</p>
          <a href="#" className="contact-link">Join Server</a>
        </div>

        <div className="contact-card">
          <div className="contact-icon">🧑</div>
          <h3>Developer</h3>
          <p>Keanu • Full Stack Developer</p>
          <a href="#" className="contact-link">LinkedIn</a>
        </div>
      </div>
    </div>
  );
}

