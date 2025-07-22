
const bcrypt = require('bcryptjs');
//const User = require('../models/User');
const LoginLog = require('../models/LoginLog');
const jwt = require('jsonwebtoken');
const Agent = require('../models/Agent');
const Customer = require('../models/Customer');

const loginController = async (req, res) => {
  const { identifier, password, role } = req.body;

   if (!identifier || !password || !role) {
    return res.status(400).json({ msg: "Missing fields" });
  }  
  if (!["Customer", "Agent"].includes(role))
    return res.status(400).json({ msg: "Invalid role" });

  const Model = role === "Customer" ? Customer : Agent;

  try {
    const user = await Model.findOne({
      $or: [{ email: identifier }, { contactNumber: identifier }]
    });

    if (!user) return res.status(400).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

  
    await LoginLog.create({
      userId: user._id,
      name: user.name,
      email: user.email,
      userType: role,
      contactNumber: user.contactNumber,
      loginTime: new Date()
    });
   
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET ,
      { expiresIn: '1h' }
    );
    res.json({ msg: `${role}Login successful`, token,
      user: {
        name: user.name,
        id: user._id,
        email: user.email,
        contactNumber: user.contactNumber
      }
     });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = loginController;
