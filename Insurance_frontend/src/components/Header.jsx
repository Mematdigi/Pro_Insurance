import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCoins,
  faBars,
  faUser,
  faCog,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="header">
      <div className="mobile-header">
        <div className="left">
          <FontAwesomeIcon icon={faBars} className="menu-toggle" onClick={toggleSidebar} />
          <h2 className="mobile-logo">Insurance CRM</h2>
        </div>
        <div className="right">
          <div className="avatar" onClick={toggleDropdown}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      <div className="desktop-header">
        <div className="left">
          {/* <h4>Welcome back, Rahul! 👋</h4> */}
          <p className="agent__name">{user?.role} portal</p>
        </div>
        <div className="right">
          <div className="notification">
            <FontAwesomeIcon icon={faBell} />
            <span className="badge">3</span>
          </div>
          <div className="coins">
            <FontAwesomeIcon icon={faCoins} />
            <span>150</span>
          </div>
          <div className="avatar" onClick={toggleDropdown}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {dropdownOpen && (
        <div className="user-dropdown" ref={dropdownRef}>
          <div className="user-info">
            <strong>{user?.name}</strong>
            <p>{user?.email}</p>
            <span className="user-role">{user?.role?.toLowerCase()}</span>
          </div>
          <hr />
          <div className="dropdown-item">
            <FontAwesomeIcon icon={faUser} />
            <span>Profile</span>
          </div>
          <div className="dropdown-item">
            <FontAwesomeIcon icon={faCog} />
            <span>Settings</span>
          </div>
          <div className="dropdown-item logout" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Log out</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
