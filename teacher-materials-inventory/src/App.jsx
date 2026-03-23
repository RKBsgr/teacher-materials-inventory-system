import { useEffect, useState, useCallback, useMemo } from "react";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Contact from "./components/Contact";
import PreviewModal from "./components/PreviewModal";
import Toast from "./components/Toast";
import Sidebar from "./components/Sidebar";
import AdminPanel from "./components/AdminPanel";
import MaterialCard from "./components/MaterialCard";
import RecycleBin from "./components/RecycleBin";
import Landing from "./components/Landing";
import UserManagement from "./components/UserManagement";
import Notifications from "./components/Notifications";

const API = import.meta.env.VITE_API_URL || 'https://teacher-materials-inventory-system.onrender.com';

export default function App() {
  const [materials, setMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [bin, setBin] = useState([]);
  const [types, setTypes] = useState([]);

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  const [showBin, setShowBin] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [page, setPage] = useState('home');

  const [previewUrl, setPreviewUrl] = useState(null);
  const [toasts, setToasts] = useState([]);

  const [viewMode, setViewMode] = useState(localStorage.getItem("viewMode") || "list");
  const [darkMode, setDarkMode] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ subject: "", type: "", category: "" });
  
  const stableSetFilters = useCallback(setFilters, []);
  const stableSetViewMode = useCallback(setViewMode, []);
  const stableSetDarkMode = useCallback(setDarkMode, []);

  // Stable data loaders & handlers - ALL defined BEFORE useEffect
  const loadMaterials = useCallback(async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`${API}/api/materials?${query}`);
      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("❌ Invalid materials response:", data);
        setMaterials([]); 
        return;
      }

      setMaterials(data);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setMaterials([]);
    }
  }, [filters, API, setMaterials]);

  const loadSubjects = useCallback(async () => {
    const res = await fetch(`${API}/api/subjects`);
    setSubjects(await res.json());
  }, [API, setSubjects]);

  const loadTypes = useCallback(async () => {
    const res = await fetch(`${API}/api/types`);
    setTypes(await res.json());
  }, [API, setTypes]);

  const addToast = useCallback((msg, type = 'success') => {
    setToasts(prev => [...prev, { message: msg, type }]);
  }, [setToasts]);

  const handlePreview = useCallback((url) => {
    setPreviewUrl(url);
  }, [setPreviewUrl]);

  // Effects - ALL reference stable callbacks above
  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);

  useEffect(() => {
    loadMaterials();
  }, [loadMaterials]);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  useEffect(() => {
    loadTypes();
  }, [loadTypes]);

  useEffect(() => {
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    } catch (err) {
      console.error("Invalid token");
    }
  }, [token]);

  async function loadBin() {
    try {
      const res = await fetch(`${API}/api/materials/bin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBin(await res.json());
    } catch (err) {
      console.error("error loading bin", err);
    }
  }

  const filteredMaterials = useMemo(() => {
    return (Array.isArray(materials) ? materials : []).filter(m => {
      if (!m || !m._id || !m.url) return false;
      const keyword = (search || "").toLowerCase();
      return (
        m.title?.toLowerCase().includes(keyword) ||
        m.subject?.toLowerCase().includes(keyword) ||
        m.type?.toLowerCase().includes(keyword) ||
        m.category?.toLowerCase().includes(keyword)
      );
    });
  }, [materials, search]);

  // Landing (no token)
  if (!token) {
    return (
      <div>
        <Navbar page={page} setPage={setPage} darkMode={darkMode} />
        <section id="home" className="landing-section">
          <Landing setToken={setToken} />
        </section>
        <section id="about">
          <About />
        </section>
        <section id="contact">
          <Contact />
        </section>
      </div>
    );
  }

  // Authenticated App
  return (
    <div>
      {previewUrl && <PreviewModal url={previewUrl} onClose={() => setPreviewUrl(null)} />}
      {toasts.map((toast, i) => (
        <Toast 
          key={i}
          message={toast.message}
          type={toast.type || 'info'}
          onClose={() => setToasts(t => t.slice(1))}
        />
      ))}
      
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        search={search}
        setSearch={setSearch}
      />

      <div className={`layout ${darkMode ? "dark" : ""}`}>
        <Sidebar
          sidebarOpen={sidebarOpen}
          filters={filters}
          setFilters={stableSetFilters}
          subjects={subjects}
          types={types}
          viewMode={viewMode}
          setViewMode={stableSetViewMode}
          darkMode={darkMode}
          setDarkMode={stableSetDarkMode}
          showUsers={showUsers}
          setShowUsers={setShowUsers}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
        />

        <main className="content">
          {showUsers ? (
            <UserManagement API={API} token={token} />
          ) : showNotifications ? (
            <Notifications API={API} token={token} />
          ) : (
            <>
              {(user?.role === "admin" || user?.role === "editor") && (
                <AdminPanel
                  API={API}
                  subjects={subjects}
                  setSubjects={setSubjects}
                  types={types}
                  setTypes={setTypes}
                  token={token}
                  loadMaterials={loadMaterials}
                  loadSubjects={loadSubjects}
                  loadTypes={loadTypes}
                  showBin={showBin}
                  setShowBin={setShowBin}
                  loadBin={loadBin}
                  user={user}
                />
              )}

              {!showBin && (
                <div className={viewMode === "grid" ? "grid-layout" : "list-layout"}>
                  {filteredMaterials.map(m => (
                    <MaterialCard
                      key={m._id}
                      material={m}
                      token={token}
                      user={user}
                      API={API}
                      loadMaterials={loadMaterials}
                      isGrid={viewMode === "grid"}
                      onPreview={handlePreview}
                      addToast={addToast}
                    />
                  ))}
                </div>
              )}

              {showBin && (user?.role === "admin" || user?.role === "editor") && (
                <RecycleBin
                  bin={bin}
                  API={API}
                  token={token}
                  loadBin={loadBin}
                  loadMaterials={loadMaterials}
                  viewMode={viewMode}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
