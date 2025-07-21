const mongoose = require("mongoose");

const policySchema = new mongoose.Schema({
  type: String,
  startDate: String,
  dueDate: String,
  premium: Number,
});

const customerSchema = new mongoose.Schema({
  name: String,
  contact: String,
  email: String,
  address: String,
  dob: String,
  policies: [policySchema],
});

module.exports = mongoose.model("Customer", customerSchema);
