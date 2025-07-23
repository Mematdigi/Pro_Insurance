const Policy = require('../models/Policy');

const getAgentPolicies = async (req, res) => {
  const { agentId, agentCode, company } = req.body;

  if (!agentId || !agentCode || !company)
    return res.status(400).json({ msg: "Missing required fields" });

  try {
    // ✅ Simulate fetched policies from external API
    const externalPolicies = [
      {
        userId: "665cb123456", // ideally customer id
        company,
        policyType: "Life",
        policyNumber: "AGT12345",
        policyDetails: {
          sumInsured: 1000000,
          premium: 12000,
          startDate: "2024-01-01",
          endDate: "2025-01-01"
        }
      },
      {
        userId: "665cb123456", // another customer id
        company,
        policyType: "Health",
        policyNumber: "AGT56789",
        policyDetails: {
          sumInsured: 500000,
          premium: 8000,
          startDate: "2024-03-01",
          endDate: "2025-03-01"
        }
      }
    ];

    // ✅ Save these policies in DB, linked to agent
    const savedPolicies = await Promise.all(
      externalPolicies.map(policy =>
        Policy.create({
          ...policy,
          agentCode,
          agentId
        })
      )
    );

    res.json({ msg: "Policies fetched and saved", policies: savedPolicies });
  } catch (err) {
    console.error("Agent fetch error:", err.message);
    res.status(500).send("Server error");
  }
};

//get coustmer policies by agent




module.exports = {getAgentPolicies};
