const mongoose = require('mongoose');
const { use } = require('react');

const LoginLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  contactNumber: String,
  email: String,
  userType: { type: String },
  loginMethod: { type: String, default: 'email' },
  loginTime: { type: Date, default: Date.now },
  ipAddress: String
});

module.exports = mongoose.model('LoginLog', LoginLogSchema);