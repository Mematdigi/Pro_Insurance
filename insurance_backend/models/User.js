const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactNumber: { type: String, required: true, unique: true, match: /^\d{10}$/ },
  email: { type: String, required: true, unique: true, match: /\S+@\S+\.\S+/ },
  password: { type: String, required: true }  //googleId: {type: String},


  //otp:{type : String},
  //otpExpires: { type: Date }
});

module.exports = mongoose.model('User', UserSchema);
