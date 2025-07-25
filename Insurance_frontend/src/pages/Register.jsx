import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("Customer"); // New
  const [form, setForm] = useState({
    name: "",
    email: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

    //setForm({ ...form, [e.target.name]: e.target.value });


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          contactNumber: form.contactNumber,
          password: form.password,
          role,
        }),
      });
      console.log("sending data to backend:", {
        name: form.name,
        email: form.email,
        contactNumber: form.contactNumber,
        password: form.password,
        role,
      });

      const data = await res.json();

      if (res.ok) {
        alert(`${role} registered successfully!`);
        navigate("/login");
      } else {
        setError(data.msg || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="register-page">
      <div className="left-panel">
        <img src="/public/happy-family-with-umbrella.png" alt="Illustration" />
      </div>

      <div className="right-panel">
        <div className="form-box">
          <h1>Start prototyping for free</h1>
          <p>Create your 100% free account and start prototyping with the best tool.</p>

          {/* 👇 Toggle Tabs Start */}
          <div className="role-toggle">
            <button
              className={role === "Customer" ? "active" : ""}
              onClick={() => setRole("Customer")}
            >
              <i className="fas fa-user"></i> Customer
            </button>
            <button
              className={role === "Agent" ? "active" : ""}
              onClick={() => setRole("Agent")}
            >
              <i className="fas fa-shield-alt"></i> Agent
            </button>
          </div>
          {/* 👆 Toggle Tabs End */}

          <form onSubmit={handleSubmit}>
            <input  type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required />
            <div className="two-col">
              <input  type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email"
                      required />
              <input type="tel"
                      name="contactNumber"
                      value={form.contactNumber}
                      onChange={handleChange}
                      placeholder="Phone"
                      required />
            </div>
            <div className="two-col">
              <input type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Password"
                      required />
              <input type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      required />
            </div>
            <div className="checkbox-line">
              <input type="checkbox" required />
              <label>I agree with the <a href="#">terms of use</a></label>
            </div>
            <button type="submit" className="signup-btn">Signup</button>
          </form>

          <p className="bottom-login">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;