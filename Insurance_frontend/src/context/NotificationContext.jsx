import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notificationsCount, setNotificationsCount] = useState(0);
  const location = useLocation();

  // ✅ Fetch unseen notification count
  const fetchNotificationCount = async () => {
    try {
      const agent = JSON.parse(localStorage.getItem("user"));
      if (!agent?.id) return;

      const res = await fetch(`http://localhost:5000/v1/notification/fetch-notification/${agent.id}`);
      if (!res.ok) throw new Error("Failed to fetch notifications");

      const Notificationdata = await res.json();
      const unseen = Notificationdata.data.filter(n => n.seen == false);
      setNotificationsCount(unseen.length || 0);
    } catch (err) {
      console.error("Error fetching notification count:", err);
    }
  };

  const markAllRead = async () => {
    try {
      const agent = JSON.parse(localStorage.getItem("user"));
      if (!agent?.id) return;

      await fetch(`http://localhost:5000/v1/notification/mark-read/${agent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      setNotificationsCount(0); 
    } catch (err) {
      console.error("Error marking notifications as read:", err);
    }
  };

  // ✅ Effect: Decide what to do based on route
  useEffect(() => {
    const isNotificationPage = location.pathname === "/agent/notification";

    if (isNotificationPage) {
      markAllRead(); // ✅ If on notification page, mark as read
    } else {
      fetchNotificationCount(); // ✅ Else, fetch count normally
    }
  }, [location]); // Runs on route change

  return (
    <NotificationContext.Provider
      value={{ notificationsCount, fetchNotificationCount, markAllRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
