import React, { createContext, useContext, useState, useEffect } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notificationsCount, setNotificationsCount] = useState(0);

  const fetchNotificationCount = async () => {
    try {
      const agent = JSON.parse(localStorage.getItem("user"));
      if (!agent?.id) return;

      const res = await fetch(`/api/notifications/count?agentId=${agent.id}`);
      if (!res.ok) throw new Error("Failed to fetch notification count");
      const data = await res.json();
      setNotificationsCount(data.count || 0);
    } catch (err) {
      console.error("Error fetching notification count:", err);
    }
  };

  useEffect(() => {
    // Fetch count only on page load or refresh
    fetchNotificationCount();
  }, []);

  return (
    <NotificationContext.Provider value={{ notificationsCount, fetchNotificationCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
