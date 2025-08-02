import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faUsers,
  faShieldAlt,
  faFileInvoiceDollar,
  faDownload,
  faSignOutAlt,
  faBars,
  faBuilding,
  faListAlt,
  faHistory,
  faExchangeAlt,
  faCalendarAlt,
  faClock,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ isOpen: initialOpen = true, toggleSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(
    JSON.parse(localStorage.getItem("sidebarOpen")) ?? initialOpen
  );
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const premiumDueCount = 5;
  const notificationsCount = 12;

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  // ✅ Toggle sidebar manually and persist state
  const handleToggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem("sidebarOpen", JSON.stringify(newState));
  };

  // ✅ Handle responsiveness but do NOT auto-close sidebar
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
    { label: "Company", path: "/agent/companies", icon: faBuilding },
    { label: "Customer List", path: "/agent/customers", icon: faUsers },
    { label: "Policy Alterations", path: "/agent/policy-alterations", icon: faExchangeAlt },
    { label: "Premium Due", path: "/agent/due-payments", icon: faCalendarAlt, badge: premiumDueCount },
    { label: "Notifications", path: "/agent/notification", icon: faPlus, badge: notificationsCount },
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
    { label: "Company", path: "/agent/companies", icon: faBuilding },
    { label: "Customer List", path: "/agent/customers", icon: faUsers },
    { label: "Premium Due", path: "/agent/due-payments", icon: faCalendarAlt, badge: premiumDueCount },
    { label: "Notifications", path: "/agent/notification", icon: faPlus, badge: notificationsCount },
    { label: "Policy Calculator", path: "#", icon: faClock },
    { label: "Logout", path: "/login", icon: faSignOutAlt },
  ];

  const customerMenu = [
    { label: "Dashboard", path: "/customer/dashboard", icon: faTachometerAlt },
    { label: "Add Polices", path: "/customer/addinsurance", icon: faDownload },
    { label: "Policies", path: "/customer/mypolicies", icon: faShieldAlt },
    { label: "Due Payments", path: "/customer/due-payments", icon: faFileInvoiceDollar },
    { label: "Logout", path: "/login", icon: faSignOutAlt },
  ];

  let menu = user?.role === "Agent"
    ? selectedCategory === "General Insurance" ? generalInsuranceMenu : lifeInsuranceMenu
    : customerMenu;

  return (
    <>
      {isMobile && (
        <button
          className="mobile-toggle-btn"
          onClick={handleToggleSidebar}
          style={{ left: isOpen ? "250px" : "15px", transition: "left 0.3s ease" }}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      )}

      <div className={`sidebar-container ${isOpen ? "open" : "collapsed"} ${isMobile && !isOpen ? "mobile-closed" : ""}`}>
        <div className="sidebar-header">
          {!isMobile && (
            <button className="toggle-btn" onClick={handleToggleSidebar}>
              <FontAwesomeIcon icon={faBars} />
            </button>
          )}
          {isOpen && <h3 className="logo-text">Insurance</h3>}
        </div>

        {/* Menu List */}
        <ul className="menu-list">
          {menu.map((item, index) =>
            item.children ? (
              <li key={index} className="tooltip-container">
                <button
                  className={`dropdown-toggle ${openDropdown === item.label ? "open" : ""}`}
                  onClick={() => toggleDropdown(item.label)}
                  data-tooltip={!isOpen ? item.label : ""}
                >
                  <FontAwesomeIcon icon={item.icon} className="menu-icon" />
                  {isOpen && <span className="menu-label">{item.label}</span>}
                </button>
                {openDropdown === item.label && isOpen && (
                  <ul className="submenu">
                    {item.children.map((child, cIdx) => (
                      <li key={cIdx} className="tooltip-container">
                        <NavLink
                          to={child.path}
                          className={({ isActive }) => (isActive ? "active" : "")}
                          data-tooltip={!isOpen ? child.label : ""}
                        >
                          <FontAwesomeIcon icon={child.icon} className="menu-icon" />
                          {isOpen && <span className="menu-label">{child.label}</span>}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ) : (
              <li key={index} className="tooltip-container">
                <NavLink
                  to={item.path}
                  className={({ isActive }) => (isActive ? "active" : "")}
                  data-tooltip={!isOpen ? item.label : ""}
                >
                  <FontAwesomeIcon icon={item.icon} className="menu-icon" />
                  {isOpen && <span className="menu-label">{item.label}</span>}
                  {item.badge && <span className="menu-badge">{item.badge}</span>}
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
