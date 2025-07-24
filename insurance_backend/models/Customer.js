const mongoose = require("mongoose");


const customerSchema = new mongoose.Schema({
  name: String,
  contact: String,
  email: String,
  password:{ type: String, required: true },
});

module.exports = mongoose.model("Customer", customerSchema);
