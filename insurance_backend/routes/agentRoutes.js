const express = require("express");
const router = express.Router();

const Policy = require("../models/AgentPolicies");

router.get("/:agentId", async (req, res) => {
  try{
    const agentId = req.params;
    console.log("📥 Agent ID:", req.params.agentId);
    const policies = await Policy.find({ agentId });
    console.log("📤 Found policies:", policies.length);
    res.status(200).json({ policies });
  } catch (err) {
    console.error("Agent policy fetch error:", err);
    res.status(500).json({ msg: "Failed to fetch agent data" });
  }
});


module.exports = router;