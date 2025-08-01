import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [role, setRole] = useState("Customer");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(300);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();
  const otpRefs = useRef([]);

  // Countdown timer for OTP
  useEffect(() => {
    let countdown;
    if (otpSent && timer > 0) {
      countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(countdown);
  }, [otpSent, timer]);

  const handleOtpChange = (value, index) => {
    if (/^\d*$/.test(value)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      // Auto move to next input if value entered
      if (value && index < 5) {
        otpRefs.current[index + 1].focus();
      }
      // Auto move to previous input on backspace
      if (!value && index > 0) {
        otpRefs.current[index - 1].focus();
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier || (!isOtpLogin && !password)) {
      setError("Please fill in all fields.");
      return;
    }

    if (isOtpLogin && otpSent) {
      // ✅ Dummy OTP verification
      const enteredOtp = otp.join("");
      if (enteredOtp === "123456") {
        const dummyUser = { name: "Test User", email: identifier };
        localStorage.setItem("user", JSON.stringify(dummyUser));
        login({ ...dummyUser, role });
        navigate(role === "Agent" ? "/select-insurance" : "/customer/dashboard");
      } else {
        setError("Invalid OTP. Please enter 123456 for testing.");
      }
    } else if (isOtpLogin) {
      // ✅ Dummy OTP sending
      if (!identifier) {
        setError("Enter email or phone to send OTP.");
        return;
      }
      setOtpSent(true);
      setTimer(300);
      setError("");
      alert("Dummy OTP sent: 123456 (use this for testing)");
    } else {
      // ✅ Password login via API
      try {
        const res = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier, password, role }),
        });
        const data = await res.json();
        if (!res.ok) return setError(data.msg || "Login failed");

        localStorage.setItem("user", JSON.stringify(data.user));
        login({ ...data.user, role });
        navigate(role === "Agent" ? "/select-insurance" : "/customer/dashboard");
      } catch {
        setError("Login failed");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo-section">
          <div className="icon-shield">🛡️</div>
          <h2>Insurance Panel</h2>
          <p>Secure access to your account</p>
        </div>

        {/* Role Toggle */}
        <div className="role-toggle">
          <button className={role === "Customer" ? "active" : ""} onClick={() => setRole("Customer")}>
            Customer
          </button>
          <button className={role === "Agent" ? "active" : ""} onClick={() => setRole("Agent")}>
            Agent
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleLogin}>
          {!otpSent ? (
            <>
              <label>Email / Phone Number</label>
              <input
                type="text"
                placeholder="Enter email or phone"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />

              {!isOtpLogin && (
                <>
                  <label>Password</label>
                  <div className="password-field">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span onClick={() => setShowPassword(!showPassword)} className="toggle-eye">
                     
                    </span>
                  </div>
                </>
              )}

              <div className="login-options">
                <label>
                  <input type="checkbox" /> Remember this device
                </label>
                <span className="otp-link" onClick={() => setIsOtpLogin(!isOtpLogin)}>
                  {isOtpLogin ? "Back to Password Login" : "Login via OTP"}
                </span>
              </div>

              <button type="submit" className="login-btn">
                {isOtpLogin ? "Send OTP" : "Login"}
              </button>
            </>
          ) : (
            <>
              <h4>Verify Your {identifier.includes("@") ? "Email" : "Mobile Number"}</h4>
              <p>A 6-digit code has been sent to <b>{identifier}</b></p>
              <div className="otp-inputs">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    maxLength="1"
                    ref={(el) => (otpRefs.current[idx] = el)}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otp[idx] && idx > 0) {
                        otpRefs.current[idx - 1].focus();
                      }
                    }}
                  />
                ))}
              </div>
              <p className="timer">
                OTP will expire in{" "}
                <span>
                  {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
                </span>
              </p>
              <p className="resend-links">
                <span onClick={() => setTimer(300)}>Resend</span> | <span>Send to alternate</span>
              </p>
              <button type="submit" className="login-btn">
                Verify
              </button>
              <p className="back-link" onClick={() => setOtpSent(false)}>← Back to password login</p>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
