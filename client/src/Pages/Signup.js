// Signup.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup({ onSignupSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, form);
//       alert("Signup successful! You can now log in.");
      if (onSignupSuccess) {
        onSignupSuccess(); // Switch to login form in AuthPage
      } else {
        navigate("/login"); // Fallback if used standalone
      }
    } catch (err) {
      alert("Signup failed. Email might already be in use.");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="auth-title">Signup</h2>
        <input className="auth-input" name="name" placeholder="Name" onChange={handleChange} required />
        <input className="auth-input" name="email" placeholder="Email" onChange={handleChange} required />
        <input className="auth-input" name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <input className="auth-input" name="phone" placeholder="Phone" onChange={handleChange} required />
        <button className="auth-button" type="submit">Signup</button>
      </form>
    </div>
  );
}
