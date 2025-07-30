const mongoose = require("mongoose");

const PolicySchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", required: true },
  agentCode: String,
  
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String, default: "" },
  customerDOB: { type: Date, default: ""}, // Date of Birth

  company: { type: String, required: true },
  insuranceType: { type: String }, // Added for clarity
  policyType: { type: String, required: true },
  policyNumber: { type: String, required: true ,unique : true }, //unique :true (deleted for testing)

  policyDetails: {
    sumInsured: { type: Number, default: 0 },
    premium: { type: Number, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true }
  },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Policy", PolicySchema);
