const Policy = require("../models/Policy");

const fetchAgentPoliciesController = async (req, res) => {
  console.log("🔥 Agent fetchPolicy route hit!");
  console.log("👉 req.body is:", req.body);
  const { agentId, agentCode, company } = req.body;

  if ( !agentCode || !company) {
    return res.status(400).json({ msg: "Missing agent info" });
  }

  try {
    // 🔁 DUMMY CUSTOMER POLICIES FOR AGENT
    const dummyPolicies = [
      {
        policyNumber: "LIC123456789",
        policyType: "Life Insurance",
        policyDetails: {
          sumInsured: 500000,
          premium: 8000,
          startDate: "2024-01-01",
          endDate: "2025-01-01",
        },
      },
    ];

    // Save to DB linked to the agent

    const savedPolicies = await Promise.all(
      dummyPolicies.map((policy) =>
        Policy.create({
          ...policy,
          company,
          agentCode,
          agentId,
          
        })
      )
    );
    console.log("Policies saved:", savedPolicies);

    res.status(200).json({
      msg: "Policies fetched and saved successfully",
      policies: savedPolicies,
    });
  } catch (err) {
    console.error("Agent fetch error:", err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = fetchAgentPoliciesController;
