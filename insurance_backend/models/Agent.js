const mongoose = require("mongoose");

const AgentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  agencyName: String,
  contactNumber: String,
  password: { type: String, required: true },
  role: { type: String, default: "Agent" }
});

module.exports = mongoose.model("Agent", AgentSchema);
