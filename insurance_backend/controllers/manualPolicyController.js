const { mongoose } = require("mongoose");
const Policy = require("../models/Policy");

const manualPolicyController = async (req, res) => {
  try {
    console.log("📥 Received POST /manual-policy");
    console.log("🧾 Request body:", req.body);

    const {
      agentId,
      agentCode,
      name,
      contact,
      email,  
      dob, // Added for DOB
      company,
      policies,
      /*
      insuranceType,
      policyId,
      policyType,
      sumInsured,
      premium,
      startDate,
      endDate,
      */
    } = req.body;
    const policy = policies[0]; // Assuming policies is an array and we take the first one
    if (!agentId || !policy?.policyId || !policy?.policyType) {
      console.log("❌ Missing required fields");
  
      return res.status(400).json({ msg: "Missing required fields" });
    }

   const newPolicy = new Policy({
    agentId,
    agentCode,

    customerName: name,
    customerPhone: contact,
    customerEmail: email,
    customerDOB: dob, // Added for DOB

    company,
    insuranceType: policy.category,
    policyNumber: policy.policyId,
    policyType: policy.policyType,
  

  policyDetails: {
    sumInsured: 0,
    premium: parseFloat(policy.premium),
    startDate: policy.startDate,
    endDate: policy.maturityDate,
  },
});


    const saved = await newPolicy.save();
    console.log("✅ Policy saved:", saved._id);
    res.status(200).json({ msg: "Policy saved", policy: saved });
  } catch (err) {
    console.error("Manual entry error:", err);
    res.status(500).json({ msg: "Failed to save policy" });
  }
};

module.exports = manualPolicyController;
