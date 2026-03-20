import { useState } from "react";

const API = import.meta.env.VITE_API_URL || 'https://teacher-materials-inventory-system.onrender.com';

export default function Landing({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    const endpoint = isLogin
      ? "/api/users/login"
      : "/api/users/register";

    const res = await fetch(API + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
    } else {
      alert(data.message || "Something went wrong");
    }
  }

  return (
    <div className="landing-container">
      <div className="landing-card">
        <h2>{isLogin ? "Login" : "Register"}</h2>

        {!isLogin && (
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />
        )}

        {!isLogin && (
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />
        )}

        {isLogin && (
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />
        )}

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button onClick={handleSubmit}>
          {isLogin ? "Login" : "Register"}
        </button>

        <p onClick={() => setIsLogin(!isLogin)} className="toggle-text">
          {isLogin
            ? "No account? Register here"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}