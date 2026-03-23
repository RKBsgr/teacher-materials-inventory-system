import { useEffect, useState } from "react";
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

  // Effects
  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);

  useEffect(() => {
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    } catch (err) {
      console.error("Invalid token");
    }
  }, [token]);

  // Load data
  useEffect(() => loadMaterials(), [filters]);
  useEffect(() => loadSubjects(), []);
  useEffect(() => loadTypes(), []);

  async function loadMaterials() {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`${API}/api/materials?${query}`);
      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("❌ Invalid materials response:", data);
        setMaterials([]); // prevent crash
        return;
      }

      setMaterials(data);

    } catch (err) {
      console.error("❌ Fetch error:", err);
      setMaterials([]);
    }
  }

  /*removed
  async function loadMaterials() {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API}/api/materials?${query}`);
    setMaterials(await res.json());
  }*/

  async function loadSubjects() {
    const res = await fetch(`${API}/api/subjects`);
    setSubjects(await res.json());
  }

  async function loadTypes() {
    const res = await fetch(`${API}/api/types`);
    setTypes(await res.json());
  }

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

  const filteredMaterials = Array.isArray(materials)
    ? materials.filter(m => {
        const keyword = (search || "").toLowerCase();
        return (
          m.title?.toLowerCase().includes(keyword) ||
          m.subject?.toLowerCase().includes(keyword) ||
          m.type?.toLowerCase().includes(keyword) ||
          m.category?.toLowerCase().includes(keyword)
        );
      })
    : [];

  /*removed
  const filteredMaterials = materials.filter(m => {
    const keyword = search.toLowerCase();
    return (
      m.title?.toLowerCase().includes(keyword) ||
      m.subject?.toLowerCase().includes(keyword) ||
      m.type?.toLowerCase().includes(keyword) ||
      m.category?.toLowerCase().includes(keyword)
    );
  });*/

  // Landing (no token) - All sections scrollable
  if (!token) {
    return (
      <div>
        <Navbar page={page} setPage={setPage} darkMode={darkMode} />
        <section id="home">
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

  // Inventory (authenticated)
  return (
    <div>
      {/* Modals */}
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
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        search={search}
        setSearch={setSearch}
      />

      <div className={`layout ${darkMode ? "dark" : ""}`}>
        <Sidebar
          sidebarOpen={sidebarOpen}
          filters={filters}
          setFilters={(data) => {
            console.log("SET FILTERS CALLED", data);
          }}
          subjects={subjects}
          types={types}
          viewMode={viewMode}
          setViewMode={setViewMode}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
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
                      onPreview={(url) => setPreviewUrl(url)}
                      addToast={(msg, type = 'success') => setToasts(prev => [...prev, { message: msg, type }])}
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

