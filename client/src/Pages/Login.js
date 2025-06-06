// src/Pages/Login.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Logo from '../images/Logo.png';

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Show message if redirected from protected route
  const message = location.state?.message;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        {
          email: form.email,
          password: form.password,
        },
        { withCredentials: true }
      );

      const { role } = response.data;

      if (role === "project-manager") {
        navigate("/add-project");
      } else if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/store");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Login failed! Please check your credentials.");
    }
  };

  return (
    <>
      <img src={Logo} alt="Logo" width="350" />

      <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2 className="auth-title">Login</h2>
          
          {message && <div className="auth-message">{message}</div>}
          {error && <div className="auth-error">{error}</div>}

          <input
            className="auth-input"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            className="auth-input"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button className="auth-button" type="submit">
            Login
          </button>
        </form>
      </div>
    </>
  );
}