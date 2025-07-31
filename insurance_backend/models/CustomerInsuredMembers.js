const mongoose = require("mongoose");

const CustomerInsuredMembersSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    policyNumber: { type: String, required: true }, // Link insured member to policy
    memberId: String,
    code: String,
    insuredName: String,
    startDate: String,
    dob: String,
    age: String,
    relationship: String,
    sumInsured: String
}, { timestamps: true });

module.exports = mongoose.model("CustomerInsuredMembers", CustomerInsuredMembersSchema);
