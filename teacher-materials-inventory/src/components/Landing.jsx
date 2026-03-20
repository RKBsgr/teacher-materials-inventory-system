import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || 'https://teacher-materials-inventory-system.onrender.com';

export default function Landing({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e) {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function togglePassword() {
    setShowPassword(!showPassword);
  }

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
        setError("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  async function handleSubmit() {
    if (!form.email.includes('@')) {
      setError('Please enter a valid email (must contain @ symbol)');
      setShowToast(true);
      return;
    }

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
      setError(data.message || "Something went wrong");
      setShowToast(true);
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
            className="landing-input"
            onChange={handleChange}
            autoComplete="username"
          />
        )}

        <input
          name="email"
          placeholder="Email"
          className="landing-input"
          onChange={handleChange}
          autoComplete="email"
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="landing-input"
            onChange={handleChange}
            autoComplete="new-password"
          />
          <button type="button" className="password-toggle" onClick={togglePassword} tabIndex="-1">
            {showPassword ? "⌣" : "👁"}
          </button>
        </div>

        {error && (
          <div className="error-message">{error}</div>
        )}

        <button className="landing-button" onClick={handleSubmit}>
          {isLogin ? "Login" : "Register"}
        </button>

        <p onClick={() => setIsLogin(!isLogin)} className="toggle-text">
          {isLogin
            ? "No account? Register here"
            : "Already have an account? Login"
          }
        </p>

        {showToast && (
          <div className="toast" onClick={() => {
            setShowToast(false);
            setError("");
          }}>
            {error}
            <span className="toast-close">&times;</span>
          </div>
        )}
      </div>
    </div>
  );
}

