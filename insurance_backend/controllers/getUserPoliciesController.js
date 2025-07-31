const Policy = require('../models/AgentPolicies');

const getUserPoliciesController = async (req, res) => {
  const userId = req.query.userId || req.user?.id;

  if (!userId) return res.status(401).json({ msg: 'User not logged in' });

  try {
    const policies = await Policy.find({ userId }).sort({createdAt: -1});
    res.json({ policies });
  } catch (err) {
    console.error('Error fetching policies:', err.message);
    res.status(500).send('Server error');
  }
};

module.exports = getUserPoliciesController;
