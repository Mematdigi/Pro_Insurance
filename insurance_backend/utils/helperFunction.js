const Notification = require("../models/Notification"); // ✅ Use correct model

// Function to save notification in DB
const saveNotification = async (agentId, policyId, message, occasion) => {
  try {
    const newNotification = new Notification({
      agentId,
      policyId,
      message,
      occasion, // <-- save occasion too
    });

    await newNotification.save();
    console.log("✅ Notification saved:", newNotification);
  } catch (error) {
    console.error("❌ Failed to save notification:", error.message);
  }
};

const formatTimeToAmPm = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // convert to 12-hour format
    return `${hours}:${minutes} ${ampm}`;
};


module.exports = {saveNotification, formatTimeToAmPm};
