const express = require('express');
const router = express.Router();
const Policy = require('../../models/Policy');
const dayjs = require('dayjs');
const { notificationController } = require("../../controllers/index");

router.get("/send-notification",notificationController.sendNotification);

module.exports = router;

 /*
  try {
    const policies = await Policy.find();
    const today = dayjs();
    const nextMonth = today.add(1, 'month');
    let count = 0;

    policies.forEach((p) => {
      const name = p.customerName || "Customer";
      const phone = p.customerPhone || "N/A";
      const dob = p.dateOfBirth;
      const agent = p.agentCode || "Your Agent";
      const endDate = p.policyDetails?.endDate;

      // Birthday
      if (dob && dayjs(dob).format('MM-DD') === today.format('MM-DD')) {
        sendNotification("birthday", phone, `🎂 Happy Birthday ${name}! - From ${agent}`);
        count++;
      }

      // Policy Expiry
      if (endDate && dayjs(endDate).format('MM-YYYY') === nextMonth.format('MM-YYYY')) {
        sendNotification("expiry", phone, `🛡️ Reminder: Your policy is expiring on ${endDate}. Contact ${agent} to renew.`);
        count++;
      }
    });

    res.json({ message: `✅ Notifications sent: ${count}` });
  } catch (err) {
    console.error("❌ Error in notification route:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
*/
