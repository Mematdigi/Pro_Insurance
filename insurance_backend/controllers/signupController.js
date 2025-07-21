const bcrypt = require('bcryptjs');
//const User = require('../models/User');
const Agent = require('../models/Agent');
const Customer = require('../models/Customer');

const signupController = async (req, res) => {
  const { name, contactNumber, email, password, role} = req.body;

  if (!["Customer", "Agent"].includes(role))
    return res.status(400).json({ msg: "Invalid role" });

  try {
    const Model = role === "Customer" ? Customer: Agent;
    const existingUser = await Model.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: `${role} User already exists` });
    //let user = await User.findOne({ email });
    //if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Model({ 
      name, 
      email, 
      contactNumber, 
      password: hashedPassword, 
      role 
    });
    await newUser.save();

    res.status(201).json({ msg: `${role}User registered successfully` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = signupController;