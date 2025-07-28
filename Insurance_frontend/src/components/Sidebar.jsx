import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faUsers,
  faShieldAlt,
  faFileInvoiceDollar,
  faCoins,
  faDownload,
  faGift,
  faSignOutAlt,
  faBars,
  faBuilding,
  faListAlt,
  faHistory,
  faExchangeAlt,
  faBookOpen,
  faCalendarAlt,
  faClock
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ isOpen = true, toggleSidebar }) => {
  const { user } = useAuth();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const selectedCategory = localStorage.getItem("selectedInsuranceType") || "Life Insurance";

  const generalInsuranceMenu = [
    { label: "Dashboard", path: "/agent/dashboard", icon: faTachometerAlt },
    { label: "Import Policy", path: "/agent/import-excel", icon: faFileInvoiceDollar },
    { label: "Add new Policy", path: "/agent/add-manual", icon: faListAlt },
    { label: "Policy Alterations", path: "/agent/policy-alterations", icon: faExchangeAlt },
    { label: "Premium Due", path: "/agent/due-payments", icon: faCalendarAlt },
    { label: "Company", path: "/agent/companies", icon: faBuilding },
    { label: "Customer List", path: "/agent/customers", icon: faUsers },
    { label: "Notifications", path: "/agent/notification", icon: faDownload },
    { label: "Logout", path: "/login", icon: faSignOutAlt },
  ];

  const lifeInsuranceMenu = [
    { label: "Dashboard", path: "/agent/dashboard", icon: faTachometerAlt },
    { label: "Import Policy", path: "/agent/import-excel", icon: faFileInvoiceDollar },
    {
      label: "Policy",
      icon: faShieldAlt,
      children: [
        { label: "Add New Policy", path: "/agent/add-manual", icon: faListAlt },
        { label: "Add Family", path: "/agent/add-family", icon: faUsers },
        { label: "Family History", path: "/agent/family-history", icon: faHistory },
        { label: "Policy Alterations", path: "/agent/policy-alterations", icon: faExchangeAlt },
      ],
    },
    
    { label: "Premium Due", path: "/agent/due-payments", icon: faCalendarAlt },
    { label: "Policy Calculator", path: "#", icon: faClock },
    { label: "Company", path: "/agent/companies", icon: faBuilding },
    { label: "Customer List", path: "/agent/customers", icon: faUsers },
    { label: "Notification", path: "/agent/notification", icon: faDownload },
    { label: "Logout", path: "/login", icon: faSignOutAlt },
  ];

  const customerMenu = [
    { label: "Dashboard", path: "/customer/dashboard", icon: faTachometerAlt },
    { label: "Add Polices", path: "/customer/addinsurance", icon: faDownload },
    { label: "Policies", path: "/customer/mypolicies", icon: faShieldAlt },
    { label: "Due Payments", path: "/customer/due-payments", icon: faFileInvoiceDollar },
    { label: "Logout", path: "/login", icon: faSignOutAlt },
  ];

  let menu;
  if (user?.role === "Agent") {
    menu = selectedCategory === "General Insurance" ? generalInsuranceMenu : lifeInsuranceMenu;
  } else {
    menu = customerMenu;
  }

  return (
    <>
      {isMobile && (
        <button
          className="mobile-toggle-btn"
          onClick={toggleSidebar}
          style={{ left: isOpen ? "250px" : "15px", transition: "left 0.3s ease" }}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      )}
      <div
        className={`sidebar-container ${isOpen ? "open" : "collapsed"} ${
          isMobile && !isOpen ? "mobile-closed" : ""
        }`}
      >
        <div className="sidebar-header">
          {!isMobile && (
            <button className="toggle-btn" onClick={toggleSidebar}>
              <FontAwesomeIcon icon={faBars} />
            </button>
          )}
          {isOpen && <h3 className="logo-text">Insurance</h3>}
        </div>

        <ul className="menu-list">
          {menu.map((item, index) =>
            item.children ? (
              <li key={index}>
                <button
                  className={`dropdown-toggle ${openDropdown === item.label ? "open" : ""}`}
                  onClick={() => toggleDropdown(item.label)}
                >
                  <FontAwesomeIcon icon={item.icon} className="menu-icon" />
                  {isOpen && <span className="menu-label">{item.label}</span>}
                </button>
                {openDropdown === item.label && isOpen && (
                  <ul className="submenu">
                    {item.children.map((child, cIdx) => (
                      <li key={cIdx}>
                        <NavLink to={child.path} className={({ isActive }) => (isActive ? "active" : "")}>
                          <FontAwesomeIcon icon={child.icon} className="menu-icon" />
                          {isOpen && <span className="menu-label">{child.label}</span>}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ) : (
              <li key={index}>
                <NavLink to={item.path} className={({ isActive }) => (isActive ? "active" : "")}>
                  <FontAwesomeIcon icon={item.icon} className="menu-icon" />
                  {isOpen && <span className="menu-label">{item.label}</span>}
                </NavLink>
              </li>
            )
          )}
        </ul>

        <div className="profile-footer">
          <img src="/public/testimonial/testimonial2.jpg" className="avatar" alt="Profile" />
          {isOpen && (
            <div>
              <div className="fw-semibold">{user?.name || "User"}</div>
              <small className="text-light">Admin Panel</small>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
