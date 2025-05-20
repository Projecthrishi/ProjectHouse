// src/Pages/AuthPage.js
import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <div>
        <button onClick={() => setIsLogin(true)} disabled={isLogin}>
          Login
        </button>
        <button onClick={() => setIsLogin(false)} disabled={!isLogin}>
          Signup
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        {isLogin ? <Login /> : <Signup onSignupSuccess={() => setIsLogin(true)} />}
      </div>
    </div>
  );
}
