export default function Header({
  sidebarOpen,
  setSidebarOpen,
  search,
  setSearch
}) {
  return (
    <div className="header">
      <h2>Teacher Materials Inventory</h2>

      <div className="header-right">
        <input
          type="text"
          placeholder="Search materials..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>

    </div>
  );
}
