export default function About() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📚 About Teacher Materials Inventory</h1>
        <p>Centralized platform for teachers to manage and share educational resources</p>
      </div>

      <div className="about-grid">
        <div className="about-card">
          <h3>🎯 Purpose</h3>
          <p>
            Organize teaching materials, lesson plans, worksheets, and resources 
            in one accessible location. Eliminate scattered files across devices.
          </p>
        </div>

        <div className="about-card">
          <h3>👥 Roles</h3>
          <ul>
            <li><strong>Admin</strong>: Full access, user management</li>
            <li><strong>Editor</strong>: Upload/delete materials</li>
            <li><strong>Viewer</strong>: Browse/download only</li>
          </ul>
        </div>

        <div className="about-card">
          <h3>☁️ Tech Stack</h3>
          <ul>
            <li>Frontend: React + Vite (Vercel)</li>
            <li>Backend: Node.js + Express (Render)</li>
            <li>Database
