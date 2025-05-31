import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Logo from '../images/Logo.png';

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      const { role } = response.data;

      if (role === "project-manager") {
        navigate("/add-project");
      } else if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/store"); // normal user redirect
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed! Please check your credentials.");
    }
  };

  return (
    <>
      
      <img src={Logo} alt="Logo" width="350" />

      <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2 className="auth-title">Login</h2>

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
