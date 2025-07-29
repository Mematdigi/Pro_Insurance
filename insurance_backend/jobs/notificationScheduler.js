const cron = require("node-cron");
const moment = require("moment");
const Policy = require("../models/Policy"); // adjust if needed
const {sendSms} = require("../services/twilio.services"); // your custom function

const startNotificationCron = async () => {
  // cron.schedule("* * * * *", async () => {
    console.log("🧪 Cron job runs every minute during testing:", new Date().toLocaleTimeString());

    const todayISO = moment().startOf('day').toISOString().split('T')[0]; // "YYYY-MM-DD"
    const oneMonthAheadISO = moment().add(1, "month").startOf('day').toISOString().split('T')[0];

    try {
      const policies = await Policy.find();

      const duePolicies = policies.filter(p => {
        // Convert endDate to ISO date string
        const endDateISO = moment(p.policyDetails.endDate).startOf('day').toISOString().split('T')[0];
        return endDateISO === oneMonthAheadISO;
      });

      const birthdays = policies.filter(p => {
        if(p.customerDOB != null){
        const dobISO = moment(p.customerDOB).startOf('day').toISOString().split('T')[0];
        return dobISO === todayISO;}
      });
if (duePolicies.length > 0) {
  console.log("Due Policies:", duePolicies);
  await Promise.all(
    duePolicies.map( p => {
      // Simple validation: skip if phone is missing or invalid length
      
      const message = `Dear ${p.customerName}, your policy (${p.policyNumber}) is due on ${p.policyDetails.endDate}. Please take necessary action.`;
      try {
        //  sendSms(p.customerPhone, message);
        console.log(p.customerPhone,message)
      } catch (error) {
        console.error(`Failed to send SMS to ${p.customerPhone}:`, error.message);
      }
    })
  );
}

if (birthdays.length > 0) {
  console.log("Birthdays:", birthdays);
  await Promise.all(
    birthdays.map(async p => {
     
      const message = `Happy Birthday, ${p.customerName}! 🎉 Wishing you a wonderful year ahead.`;
      try {
      //  sendSms(p.customerPhone, message);
       console.log(p.customerPhone,message)
      } catch (error) {
        console.error(`Failed to send SMS to ${p.customerPhone}:`, error.message);
      }
    })
  );
}


    } catch (error) {
      console.error("❌ Cron job error:", error.message);
    }
  // });
};


module.exports = startNotificationCron;
