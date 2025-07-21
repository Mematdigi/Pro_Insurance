const Policy = require('../models/Policy');

const addPolicyController = async (req, res) => {
  const { company, policyType, policyNumber, policyDetails } = req.body;
  const userId = req.body.userId || req.user?.id; // use logged-in user's ID if JWT later

  if (!userId) return res.status(401).json({ msg: 'User not logged in' });

  try {
    const policy = new Policy({
      userId,
      company,
      policyNumber,
      policyDetails
    });

    await policy.save();
    res.status(201).json({ msg: 'Policy added successfully', policy });
  } catch (err) {
    console.error('Error saving policy:', err.message);
    res.status(500).send('Server error');
  }
};

module.exports = addPolicyController;
