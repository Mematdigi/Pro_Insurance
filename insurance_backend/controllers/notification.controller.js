
const Policy = require('../models/Policy');
const dayjs = require('dayjs');
const { sendSms } = require('../services/textTwillioScheduler'); 

class notificationController{
        sendNotification =  async (req, res) => {
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

const today = new Date();
const todayMonth = today.getMonth(); // 0-indexed (Jan = 0)
const todayDate = today.getDate();

const birthdayCustomers = birthdayPolicies.filter(p => {
  const dob = new Date(p.customerDOB);
  return dob.getMonth() === todayMonth && dob.getDate() === todayDate;
});

        
            // Simulate notification sending
            duePolicies.forEach(p => {
              console.log(`📩 Reminder: ${p.customerName}'s policy is due on ${p.dueDate}`);
            });
        
            birthdayCustomers.forEach(p => {
             const message= `🎂 Happy Birthday : ${p.customerName} (${p.customerDOB})`
              sendSms(p.customerPhone,message)
            });
        
            res.json({
              duePoliciesCount: duePolicies.length,
              birthdayMessages: birthdayCustomers,
              message: "Notifications processed (console log only)."
            });
          } catch (err) {
            console.error("Notification error:", err);
            res.status(500).json({ error: "Failed to send notifications" });
          }
        }
}

module.exports = new notificationController();