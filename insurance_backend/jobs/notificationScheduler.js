const cron = require("node-cron");
const moment = require("moment");
const Policy = require("../models/Policy"); // adjust if needed
const sendNotification = require("../services/twilio.services"); // your custom function

function startNotificationCron() {
  cron.schedule("* * * * *", async () => {
    console.log("🧪 Cron job runs every minute during testing:", new Date().toLocaleTimeString());

    const today = moment().format("MM-DD");
    const oneMonthAhead = moment().add(1, "month").format("YYYY-MM-DD");

    try {
      const policies = await Policy.find();

      const duePolicies = policies.filter(p => {
        return moment(p.dueDate).format("YYYY-MM-DD") === oneMonthAhead;
      });

      const birthdays = policies.filter(p => {
        return p.dob && moment(p.dob).format("MM-DD") === today;
      });

      const anniversaries = policies.filter(p => {
        return p.anniversary && moment(p.anniversary).format("MM-DD") === today;
      });

      // Call custom utility to send notifications (email/sms/push/etc)
      if (duePolicies.length) sendNotification(duePolicies, "due");
      if (birthdays.length) sendNotification(birthdays, "birthday");

      if (anniversaries.length) sendNotification(anniversaries, "anniversary");

    } catch (error) {
      console.error("❌ Cron job error:", error.message);
    }
  });
}

module.exports = startNotificationCron;
