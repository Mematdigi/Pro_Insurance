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

module.exports = saveNotification;
