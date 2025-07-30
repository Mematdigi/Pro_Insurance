
const Policy = require('../models/AgentPolicies');
const dayjs = require('dayjs');
const { sendSms } = require('../services/twilio.services');
const saveNotification = require('../utils/helperFunction'); // Import save function
const Notification = require("../models/Notification");  // Ensure correct model is used

class notificationController {
sendNotification = async (req, res) => {
    try {
      const { message, phone,agentId, policyId } = req.body;

      // Default occasion if not provided
      const finalOccasion = "Custom";

      console.log(`📩 Sending SMS to ${phone}: ${message}`);

      // Simulate SMS sending (replace with actual sendSms logic)
      const smsSent = true; // await sendSms(phone, message);

      if (smsSent) {
        // Save notification in DB
        await saveNotification(agentId, policyId, message, finalOccasion);

        res.json({
          message: "Message sent successfully",
        });
      } else {
        res.status(500).json({
          error: "Failed to send SMS",
        });
      }
    } catch (err) {
      console.error("Notification error:", err);
      res.status(500).json({ error: "Failed to send notifications" });
    }
  };


  fetchNotification = async (req, res) => {
    try {
      const { agentId } = req.params;
      const { occasion } = req.query;

      // Start of today (midnight) and current time
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const now = new Date();

      // Build query
      const query = {
        agentId,
        createdAt: { $gte: startOfDay, $lte: now }
      };

      if (occasion && occasion !== 'all') {
        query.occasion = occasion;
      }

      // Fetch notifications and populate policyId
      const notifications = await Notification.find(query)
        .populate({
          path: "policyId",
          select: "customerName customerEmail customerPhone" // only these fields
        })
        .sort({ createdAt: -1 });

      // Map notifications to desired format
      const formattedData = notifications.map(n => ({
        customerName: n.policyId?.customerName || "N/A",
        customerEmail: n.policyId?.customerEmail || "N/A",
        customerPhone: n.policyId?.customerPhone || "N/A",
        occasion: n.occasion || "N/A"
      }));

      res.json({
        success: true,
        count: formattedData.length,
        data: formattedData
      });
    } catch (err) {
      console.error("❌ Failed to fetch notifications:", err);
      res.status(500).json({ success: false, error: "Failed to fetch notifications" });
    }
  };

  // view message 
  viewMessage = async (req, res) => {
    try {
      const { message_id } = req.params;
      const notifications = await Notification.find({ _id: message_id })

      res.status(200).json({
        success: true,
        data: notifications
      });}
      catch (err) {
        console.error("❌ Failed to fetch message:", err);
        res.status(500).json({ success: false, error: "Failed to fetch message" });
      }}
}

module.exports = new notificationController();
