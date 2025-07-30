const cron = require("node-cron");
const moment = require("moment");
const Policy = require("../models/Policy"); // adjust if needed
const {sendSms} = require("../services/twilio.services"); // your custom function
const saveNotification = require("../utils/helperFunction"); // Import save function
const Notification = require("../models/Notification");  // Ensure correct model is used

const startNotificationCron = async () => {
  // cron.schedule("2 12 * * *", async () => {
    console.log("🕛 Cron job running at 12 PM:", new Date().toLocaleTimeString());

    const todayStr = new Date().toISOString().split("T")[0];
    const oneMonthAheadDate = new Date();
    oneMonthAheadDate.setMonth(oneMonthAheadDate.getMonth() + 1);
    const oneMonthAheadStr = oneMonthAheadDate.toISOString().split("T")[0];

    try {
      const policies = await Policy.find();

      // ✅ Filter Due Policies
      const duePolicies = policies.filter(p => p.policyDetails?.endDate === oneMonthAheadStr);

      // ✅ Filter Birthdays (compare only MM-DD)
      const todayMonthDay = moment().format("MM-DD");
      const birthdays = policies.filter(p => {
        if (!p.customerDOB) return false;
        return moment(p.customerDOB).format("MM-DD") === todayMonthDay;
      });

      // ✅ Send Due Policy Notifications
      if (duePolicies.length > 0) {
        await Promise.all(
          duePolicies.map(async (p) => {
            const message = `Dear ${p.customerName}, your policy (${p.policyNumber}) is due on ${p.policyDetails.endDate}. Please take necessary action. Sent at ${new Date().toLocaleTimeString()}`;

            try {
              const smsSent = true
             //sendSms(p.customerPhone, message)

              if (smsSent && message) {
                console.log("📩 SMS Sent to:", p.customerPhone, "=>", message);
                await saveNotification(
                  p.agentId,
                  p._id,
                  message,
                  "Policy Due" // <-- hardcoded occasion
                );
              } else {
                console.warn(`⚠️ SMS failed for ${p.customerPhone}, skipping DB save.`);
              }
            } catch (error) {
              console.error(`❌ Failed to send SMS to ${p.customerPhone}:`, error);
            }
          })
        );
      }

      // ✅ Send Birthday Notifications
      if (birthdays.length > 0) {
        await Promise.all(
          birthdays.map(async (p) => {
            const message = `Happy Birthday, ${p.customerName}! 🎉 Wishing you a wonderful year ahead. Sent at ${new Date().toLocaleTimeString()}`;

            try {
               const smsSent = true
              // sendSms(p.customerPhone, message)

              if (smsSent && message) {
                console.log("🎂 Birthday SMS Sent to:", p.customerPhone, "=>", message);
                await saveNotification(
                  p.agentId,
                  p._id,
                  message,
                  "Birthday" // <-- hardcoded occasion
                );
              } else {
                console.warn(`⚠️ Birthday SMS failed for ${p.customerPhone}, skipping DB save.`);
              }
            } catch (error) {
              console.error(`❌ Failed to send Birthday SMS to ${p.customerPhone}:`, error);
            }
          })
        );
      }

    } catch (error) {
      console.error("❌ Cron job error:", error.message);
    }
  // });
}


module.exports = startNotificationCron;
