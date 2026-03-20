import { useEffect, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";
import MaterialCard from "./components/MaterialCard";
import RecycleBin from "./components/RecycleBin";
import Landing from "./components/Landing";

const API = import.meta.env.VITE_API_URL || 'https://teacher-materials-inventory-system.onrender.com';

export default function App() {
  const [materials, setMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [bin, setBin] = useState([]);
  const [types, setTypes] = useState([]);

  //edited
  const [adminToken, setAdminToken] = useState(null);
  //added
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  const [showLogin, setShowLogin] = useState(false);
  const [showBin, setShowBin] = useState(false);

  const [viewMode, setViewMode] = useState(() => {
    // initialize from local storage for this device only
    return localStorage.getItem("viewMode") || "list";
  });
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  //added
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);
  //addedstep3
  useEffect(() => {
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    } catch (err) {
      console.error("Invalid token");
    }
  }, [token]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    subject: "",
    type: "",
    category: ""
  });

  /* ================= VERIFY TOKEN ================= */

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API}/api/admin/verify`, {
      headers: { Authorization: token }
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(() => setAdminToken(token))
      .catch(() => {
        localStorage.removeItem("token");
        setAdminToken(null);
      });
  }, []);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    loadMaterials();
  }, [filters]);

  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {
    loadTypes();
  }, []);

  async function loadMaterials() {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API}/api/materials?${query}`);
    setMaterials(await res.json());
  }

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
        headers: { Authorization: adminToken }
      });
      const data = await res.json();
      setBin(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("error loading bin", err);
      setBin([]);
    }
  }

  function logoutAdmin() {
    localStorage.removeItem("token");
    setAdminToken(null);
    setShowBin(false);
  }

  const filteredMaterials = materials.filter(m => {
    const keyword = search.toLowerCase();
    return (
      m.title?.toLowerCase().includes(keyword) ||
      m.subject?.toLowerCase().includes(keyword) ||
      m.type?.toLowerCase().includes(keyword) ||
      m.category?.toLowerCase().includes(keyword)
    );
  });

  //added
  if (!token) {
    return <Landing setToken={setToken} />;
  }

  return (
    <>
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
          setFilters={setFilters}
          subjects={subjects}
          types={types}
          viewMode={viewMode}
          setViewMode={setViewMode}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          adminToken={adminToken}
          logoutAdmin={logoutAdmin}
          showLogin={showLogin}
          setShowLogin={setShowLogin}
        />

        {showLogin && !adminToken && (
          <Login onClose={() => setShowLogin(false)} />
        )}

        <main className="content">
          {user?.role === "admin" && (
            <AdminPanel
              API={API}
              subjects={subjects}
              setSubjects={setSubjects}
              types={types}
              setTypes={setTypes}
              adminToken={adminToken}
              loadMaterials={loadMaterials}
              loadSubjects={loadSubjects}
              loadTypes={loadTypes}
              showBin={showBin}
              setShowBin={setShowBin}
              loadBin={loadBin}
            />
          )}

          {!showBin && (
            <div className={viewMode === "grid" ? "grid-layout" : "list-layout"}>
              {filteredMaterials.map(m => (
                <MaterialCard
                  key={m._id}
                  material={m}
                  adminToken={adminToken}
                  user={user}
                  API={API}
                  loadMaterials={loadMaterials}
                  isGrid={viewMode === "grid"}
                />
              ))}
            </div>
          )}

          {showBin && user?.role === "admin" && (
            <RecycleBin
              bin={bin}
              API={API}
              adminToken={adminToken}
              loadBin={loadBin}
              loadMaterials={loadMaterials}
              viewMode={viewMode}
            />
          )}
        </main>
      </div>
    </>
  );
}