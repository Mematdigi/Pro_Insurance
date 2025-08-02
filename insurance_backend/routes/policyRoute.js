const express = require('express');
const router = express.Router();
const Policy = require('../models/AgentPolicies');
const fetchAgentPolicies = require('../controllers/fetchAgentPoliciesController');
const { getPoliciesByAgent, getInsuranceByCategory,getCoustomerPolicyList} = require('../controllers/policyController');
const addPolicy = require('../controllers/addPolicyController');
const getPolicies = require('../controllers/getUserPoliciesController');
const mongoose = require("mongoose");

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

router.get("/due-next-month/:agentId", async (req, res) => {
  try {
    const { agentId } = req.params;
    console.log ("Fetching due payments for agent:", agentId);
    const today = new Date();
    const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1); // Start of next month
    const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0); // End of next month
    const policies = await Policy.find({ agentId :new mongoose.Types.ObjectId(agentId)});
    console.log("Policies fetched for agent:", policies.length);
    console.log("sample policy:", policies[0]);
    
    const duePolicies = policies.filter((policy) => {
      if (!policy.policyDetails?.endDate) return false; // Skip policies without endDate
      const endDate = new Date(policy.policyDetails.endDate);
      return (endDate <= nextMonthEnd);
    });
    res.json(duePolicies);
  } catch (error) {
    console.error("❌ Error fetching due payments for next month:", error);
    res.status(500).json({ message: "Server error" });
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
    const newPolicy = new Policy({
      ...req.body,
    agentId:new mongoose.Types.ObjectId(req.body.agentId)
  });
    await newPolicy.save();
    res.status(201).json({ msg: "Policy added successfully" });
  } catch (error) {
    console.error("Error adding policy:", error.message, error.stack);
    res.status(500).json({ msg: error.message });
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

// Fetch policy by policy number
router.get("/policies/search", async (req, res) => {
  try {
    const { policyNumber } = req.query;
    if (!policyNumber) return res.status(400).json({ msg: "Policy number is required" });

    const policy = await Policy.findOne({ policyNumber: policyNumber.trim() });
    if (!policy) return res.status(404).json({ msg: "Policy not found" });

    res.json(policy);
  } catch (error) {
    console.error("Error searching policy:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Update policy (partial updates)
router.patch("/policies/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedPolicy = await Policy.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedPolicy) return res.status(404).json({ msg: "Policy not found" });
    res.json({ msg: "Policy updated successfully", updatedPolicy });
  } catch (error) {
    console.error("Error updating policy:", error);
    res.status(500).json({ msg: "Server error" });
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
