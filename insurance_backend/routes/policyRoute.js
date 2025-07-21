const express = require('express');
const router = express.Router();
const Policy = require('../models/Policy'); // Assuming you have a Policy model defined

const fetchAgentPolicies = require('../controllers/fetchAgentPoliciesController'); // Assuming this is for agents to fetch policies
const { getPoliciesByAgent,getInsuranceByCategory } = require('../controllers/policyController');
//         <div className="step step-1">
const addPolicy = require('../controllers/addPolicyController');
const getPolicies = require('../controllers/getUserPoliciesController');

const upload = require("../middleware/upload");
const uploadExcelController = require("../controllers/uploadExcelController");

router.post(
  "/agent/upload-excel",
  upload.single("file"),
  uploadExcelController
);
const manualPolicyController = require('../controllers/manualPolicyController');

router.post("/agent/manual-policy", manualPolicyController);

router.get("/policies", async (req, res) => {
  try {
    const { company, agentId} = req.query;

    if (!company || !agentId) {
      return res.status(400).json({ error: "Company and agent name is required." });
    }

    const filter = {
      company:{ $regex:new RegExp(`^${company.trim()}$`, "i") }, // case-insensitive exact match
      agentId: agentId, // Assuming agentId is passed in the query
    };

    const policies = await Policy.find(filter);

    res.json({policies});
  } catch (error) {
    console.error("❌ Failed to fetch policies by company:", error);
    res.status(500).json({ error: "Server error while fetching policies." });
  }
});


router.get('/due', async (req, res) => {
  try {

    const { agentId } = req.query;
    if (!agentId) {
      return res.status(400).json({ message: 'Agent ID is required' });
    }

    const policies = await Policy.find({agentId});

    const dueList = policies.map((p) => ({
      name: p.customerName || 'Unknown',
      contact: p.customerPhone || 'N/A',
      company: p.company || 'Unknown',
      type: p.policyType || 'N/A',
      premium: p.policyDetails?.premium || 0,
      dueDate: p.policyDetails?.endDate || 'N/A',
    }));

    res.json(dueList);
  } catch (error) {
    console.error('❌ Error fetching due payments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get("/customer/:id", async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);
    if (!policy) return res.status(404).json({ message: "Customer not found" });
    res.json(policy);
  } catch (err) {
    console.error("Error fetching customer:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});


//----------------------------------------------

 //-----------------------------------------------




router.post('/add-policy', addPolicy);
router.get('/my-policies', getPolicies);
router.post('/agent/agent-policies', fetchAgentPolicies); // Assuming this is for agents to fetch policies
router.get('/agent/:agentId', getPoliciesByAgent);// Assuming this is for agents to fetch policies
router.get('/Insurance-by-Category',getInsuranceByCategory)// For agent to fetch insurance by category

module.exports = router;
