const Policy = require('../models/Policy');

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

//changes by suraj 
// Controller for getpolicy
const getInsuranceByCategory = async(req,res)=>{
    const insuranceType  = req.query.insuranceType
    const agentId = req.query.agentId
    console.log(insuranceType)
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


module.exports = { getPoliciesByAgent,getInsuranceByCategory };
