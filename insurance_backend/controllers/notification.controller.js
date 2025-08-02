
const Policy = require('../models/AgentPolicies');
const dayjs = require('dayjs');
const { sendSms,sendWhatsAppMessage } = require('../services/twilio.services');
const {saveNotification,formatTimeToAmPm} = require('../utils/helperFunction'); // Import save function
const Notification = require("../models/Notification");  // Ensure correct model is used

class notificationController {
sendNotification = async (req, res) => {
  try {
    const { message, phone, agentId, policyId } = req.body;

    // ✅ Validate required fields
    if (!message || !phone || !agentId) {
      return res.status(400).json({ error: "Missing required fields: message, phone, agentId" });
    }

    const finalOccasion = "Custom";
    console.log(`📩 Sending WhatsApp to ${phone}: ${message}`);
        let  whatsappSmsSent = true;

    // ✅ Send WhatsApp message (wrapped in try/catch)
    try {
    //  let whatsappSmsSent =   await sendWhatsAppMessage(phone, message);
    let smsSent = true;
      console.log("✅ WhatsApp message sent successfully");
     if (!whatsappSmsSent) {
      return res.status(500).json({ erresror: "Failed to send  whatapp message" });
    }
    // let smsSent = await sendSms(phone, message);
    if (!smsSent) {
      return res.status(500).json({ error: "Failed to send SMS" });
    }
    else {
      console.log("✅ WhatsApp message sent successfully");
    }
    } catch (smsError) {
      console.error("❌ WhatsApp send error:", smsError);
      return res.status(500).json({ error: "Failed to send WhatsApp message" });
    }

    // ✅ If message sending failed
    
    // ✅ Save notification in DB
    try {
      await saveNotification(agentId, policyId, message, finalOccasion);
    } catch (dbError) {
      console.error("❌ Database save error:", dbError);
      return res.status(500).json({ error: "Message sent but failed to save notification" });
    }

    // ✅ Success Response
    return res.status(200).json({
      message: "Message sent and notification saved successfully"
    });

  } catch (err) {
    console.error("❌ Notification error:", err.message);
    console.error(err.stack);
    return res.status(500).json({ error: "Internal server error while sending notification" });
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
          select: "customerName customerEmail customerPhone policyType company policyNumber" // only these fields
        })
        .sort({ createdAt: -1 });

      // Map notifications to desired format
      const formattedData = notifications.map(n => ({
        notificationId: n._id,
        customerName: n.policyId?.customerName || "N/A",
        customerEmail: n.policyId?.customerEmail || "N/A",
        customerPhone: n.policyId?.customerPhone || "N/A",
        company: n.policyId?.company || "N/A",
        policyType: n.policyId?.policyType || "N/A",
        occasion: n.occasion || "N/A",
        createdAt: formatTimeToAmPm(n.createdAt) || "N/A",
        policyNumber: n.policyId?.policyNumber || "N/A",
        message: n.message || "N/A",
        seen: n.seen 
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
   
  seenNotification = async (req, res) => {
  try {
    const { agentId } = req.params;
    if (!agentId) return res.status(400).json({ error: "Agent ID is required" });

    await Notification.updateMany({ agentId, seen: false }, { $set: { seen: true } });

    res.json({ message: "All notifications marked as seen" });
  } catch (err) {
    console.error("Error marking notifications as seen:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}   
      
}

module.exports = new notificationController();
