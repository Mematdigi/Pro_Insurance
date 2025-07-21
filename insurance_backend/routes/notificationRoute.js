const express = require('express');
const router = express.Router();
const Policy = require('../models/Policy');
const dayjs = require('dayjs');

router.get("/send", async (req, res) => {
  try{
    
  const now = new Date();
  const nextMonth = now.getMonth()+1;

  const duePolicies = await Policy.find({
    dueDate:{
      $gte: new Date(now.getFullYear(), now.getMonth() + 1,1),
      $lt: new Date(now.getFullYear(), now.getMonth() +2,1),
    },
  });
  const birthdayPolicies = await Policy.find({
    "customerDOB":{$exists: true}
  });
   const birthdayCustomers = birthdayPolicies.filter(p => {
      const dob = new Date(p.customerDOB);
      return dob.getMonth() === nextMonth % 12;
    });

    // Simulate notification sending
    duePolicies.forEach(p => {
      console.log(`📩 Reminder: ${p.customerName}'s policy is due on ${p.dueDate}`);
    });

    birthdayCustomers.forEach(p => {
      console.log(`🎂 Happy Birthday in advance: ${p.customerName} (${p.customerDOB})`);
    });

    res.json({
      duePoliciesCount: duePolicies.length,
      birthdayCount: birthdayCustomers.length,
      message: "Notifications processed (console log only)."
    });
  } catch (err) {
    console.error("Notification error:", err);
    res.status(500).json({ error: "Failed to send notifications" });
  }
});

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
