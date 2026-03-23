export default function Sidebar({
  sidebarOpen,
  filters,
  setFilters,
  types,
  subjects,
  viewMode,
  setViewMode,
  darkMode,
  setDarkMode,
  showUsers,
  setShowUsers,
  showNotifications,
  setShowNotifications,
}) {
  return (
    <aside className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
      
      <div className="sidebar-section">
        <h3>Browse</h3>

        <h4 className="section-title">Sort by</h4>
        <select
          value={filters.category || ""}
          onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}
        >
          <option value="">All Categories</option>
          <option value="Uploaded">Uploaded</option>
          <option value="External Link">External Link</option>
        </select>

        <select
          value={filters.subject || ""}
          onChange={e => setFilters(prev => ({ ...prev, subject: e.target.value }))}
        >
          <option value="">All Subjects</option>
          {subjects.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={filters.type || ""}
          onChange={e => setFilters(prev => ({ ...prev, type: e.target.value }))}
        >
          <option value="">All Types</option>
          {types.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <h4 className="section-title">Change Mode</h4>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="secondary"
        >
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>

        <h4 className="section-title">Change View</h4>
        <div className="view-toggle">
          <button
            className={viewMode === "list" ? "active" : ""}
            onClick={() => setViewMode("list")}
          >
            List
          </button>

          <button
            className={viewMode === "grid" ? "active" : ""}
            onClick={() => setViewMode("grid")}
          >
            Grid
          </button>
        </div>

        <h4 className="section-title">User Management</h4>
        <button
          className="secondary"
          onClick={() => setShowUsers(!showUsers)}
        >
          Users
        </button>
        <button
          className="secondary"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          🔔 Notifications
        </button>

        <h4 className="section-title">Account</h4>
        <button
          className="secondary"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
        >
          🚪 Logout
        </button>

        {/*removed admin access from sidebar, moved to header --- IGNORE ---
        <h4 className="section-title">Admin Access</h4>
        {!adminToken ? (
          <button onClick={() => setShowLogin(!showLogin)}>
            Admin Login
          </button>
        ) : (
          <button className="secondary" onClick={logoutAdmin}>
            Exit Admin
          </button>
        )}*/}
      </div>
    </aside>
  );
}
