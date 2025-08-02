const express = require('express');
const router = express.Router();
const Policy = require('../../models/AgentPolicies');
const dayjs = require('dayjs');
const { notificationController, } = require("../../controllers/index");
const startNotificationCron = require("../../jobs/notificationScheduler")


router.post("/send-notification", notificationController.sendNotification);

router.get("/send-notification", async (req, res) => {
  await startNotificationCron();  // start the cron job
  res.send("✅ Notification cron started!");
});

router.get("/fetch-notification/:agentId", notificationController.fetchNotification);

router.get("/view-message/:message_id", notificationController.viewMessage);

router.put("/mark-read/:agentId",notificationController.seenNotification)

module.exports = router;
