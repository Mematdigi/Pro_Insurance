const mongoose = require("mongoose");

const familyMemberSchema = new mongoose.Schema({
  name: String,
  relation: String,
  age: Number,
  dob: String,
  occupation: String,
  nomineeName: String,
  nomineeRelation: String,
  status: { type: String, default: "Active" },
});

const familyGroupSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", required: true },
  groupId: { type: String, required: true, unique: true },
  primaryHolder: String,
  policyNumber: String,
  familyMembers: [familyMemberSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FamilyGroup", familyGroupSchema);
