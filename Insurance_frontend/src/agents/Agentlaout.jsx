import React from "react";
import Sidebar from "../components/Sidebar";
import { NotificationProvider } from "../context/NotificationContext";

const AgentLayout = ({ children }) => {
  return (
    <NotificationProvider>
      {/* ✅ Sidebar is always inside NotificationProvider */}
      <Sidebar />
      {/* ✅ Page content shifts right to accommodate Sidebar */}
      <div>
        {children}
      </div>
    </NotificationProvider>
  );
};

export default AgentLayout;
