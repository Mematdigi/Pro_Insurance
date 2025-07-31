const Policy = require('../models/AgentPolicies');
const mongoose = require('mongoose');

const getPoliciesByAgent = async (req, res) => {
  const { agentId } = req.params;

  try {
    const policies = await Policy.find({ agentId });
    res.status(200).json(policies);
  } catch (err) {
    console.error("Error fetching agent policies:", err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Controller for getpolicy category
const getInsuranceByCategory = async(req,res)=>{
    const insuranceType  = req.query.insuranceType
    const agentId = req.query.agentId
  try {
  const policies = await Policy.find({
    insuranceType: insuranceType,
    agentId: agentId
  });
    res.status(200).json(policies);
  } catch (err) {
    console.error("Error fetching agent policies:", err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

const getCoustomerPolicyList = async(req,res) => {
        const agentId = req.params.agentId
        console.log(agentId)
        //string to object
      const agentObjectId = new mongoose.Types.ObjectId(agentId);
       console.log('agentObjectId:', agentObjectId);
        const  customerPhone = req.params.customerPhone
        const customerEmail = req.params.customerEmail
      try {
      const policyList = await Policy.find({
        agentId:agentObjectId,
        customerPhone: customerPhone,
        customerEmail: customerEmail
      });
        res.status(200).json(policyList);
      } catch (err) {
        console.error("Error fetching agent policies:", err);
        res.status(500).json({ msg: "Internal Server Error" });
      }
}


module.exports = { getPoliciesByAgent,getInsuranceByCategory,getCoustomerPolicyList };
