import { useState } from "react";

const API = import.meta.env.VITE_API_URL || 'https://teacher-materials-inventory-system.onrender.com';

export default function Login({ onClose }) {
  const [form, setForm] = useState({ username: "", password: "" });

  async function login() {
    const res = await fetch(`${API}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.reload();
    } else {
      alert("Invalid credentials");
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="login-box">
          <input
            placeholder="Username"
            onChange={e => setForm({ ...form, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          <button onClick={login}>Login</button>
        </div>
      </div>
    </div>
  );
}