const express = require('express');
const router = express.Router();
const Policy = require('../models/Policy');
const fetchAgentPolicies = require('../controllers/fetchAgentPoliciesController');
const { getPoliciesByAgent, getInsuranceByCategory,getCoustomerPolicyList} = require('../controllers/policyController');
const addPolicy = require('../controllers/addPolicyController');
const getPolicies = require('../controllers/getUserPoliciesController');

const upload = require("../middleware/upload");
const uploadExcelController = require("../controllers/uploadExcelController");

router.post("/agent/upload-excel",upload.single("file"),uploadExcelController);
const manualPolicyController = require('../controllers/manualPolicyController');
const { get } = require('mongoose');

router.post("/agent/manual-policy", manualPolicyController);

router.get("/policies", async (req, res) => {
  try {
    const { company, agentId } = req.query;

    if (!company || !agentId) {
      return res.status(400).json({ error: "Company and agent name is required." });
    }

    const filter = {
      company: { $regex: new RegExp(`^${company.trim()}$`, "i") }, // case-insensitive exact match
      agentId: agentId, // Assuming agentId is passed in the query
    };

    const policies = await Policy.find(filter);

    res.json({ policies });
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

    const policies = await Policy.find({ agentId });

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

router.post("/policies", async (req, res) => {
  try {
    const newPolicy = new Policy(req.body);
    await newPolicy.save();
    res.status(201).json({ msg: "Policy added successfully" });
  } catch (error) {
    console.error("Error adding policy:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/by-id/:policyId", async (req, res) => {
  console.log("Fetching policy for member:", req.params.policyId);
  try {
    const policy = await Policy.findById(req.params.policyId ); // Ensure memberId is stored in Policy DB
    if (!policy) return res.status(404).json(msg , "Policy not found for this member");
    res.json(policy);
  } catch (error) {
    console.error("Error fetching policy:", error);
    res.status(500).json({ msg: "Server error" });
  }
});



router.get("/check/:policyNumber", async (req, res) => {
  try {
    const policy = await Policy.findOne({ policyNumber: req.params.policyNumber });
    if (policy) {
      return res.status(200).json({ exists: true, policy });
    }
    return res.status(200).json({ exists: false });
  } catch (error) {
    console.error("Error checking policy:", error);
    res.status(500).json({ msg: "Server error while checking policy" });
  }
});


//----------------------------------------------

//-----------------------------------------------
router.post('/add-policy', addPolicy);
router.get('/my-policies', getPolicies);
//route for agent to fetch policies
router.post('/agent/agent-policies', fetchAgentPolicies);
router.get('/agent/:agentId', getPoliciesByAgent);// Assuming this is for agents to fetch policies
//fetch insurance by category
router.get('/Insurance-by-Category', getInsuranceByCategory)
//fetch total policy of the customer
router.get('/customer-policies/:agentId/:customerPhone/:customerEmail', getCoustomerPolicyList);

module.exports = router;
