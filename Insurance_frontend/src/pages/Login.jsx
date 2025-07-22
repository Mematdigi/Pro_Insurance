import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [role, setRole] = useState("Customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

 const handleLogin = async (e) => {
  e.preventDefault();
  if (!email || !password) {
    setError("Please enter both email and password");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: email,
        password:password,
        role: role
      })
    });

    const data = await res.json();
    console.log("Agent logged in:", data.user);

    if (!res.ok) {
      alert(data.msg || "Login failed");
      return;
    }
    localStorage.setItem("user", JSON.stringify(data.user));
    login({...data.user, role});
 
    if (role === "Agent") {
      navigate("/select-insurance");
    } else {
      navigate("/customer/dashboard");
    }
  } catch (error) {
    alert("Please enter valid credentials");
  }
};

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="logo-section">
          <div className="icon-shield">🛡️</div>
          <h2>Insurance CRM</h2>
          <p className="subtitle">Sign in to your account</p>
        </div>

        <div className="demo-box">
          <strong>Demo Credentials:</strong>
          <p>Agent: agent@example.com / password</p>
          <p>Customer: customer@example.com / password</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="role-toggle">
            <button
              type="button"
              className={role === "Customer" ? "active" : ""}
              onClick={() => setRole("Customer")}
            >
              Customer
            </button>
            <button
              type="button"
              className={role === "Agent" ? "active" : ""}
              onClick={() => setRole("Agent")}
            >
              Agent
            </button>
          </div>

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="sign-in-btn">Sign In</button>

          <p className="bottom-note">
            Don’t have an account? <Link to="/register">Register Now</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
