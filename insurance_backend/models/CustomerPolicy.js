const mongoose = require("mongoose");

const CustomerPolicySchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    policyHolderPhone: String,
    policyHolderName: String,
    policyHolderAddress: String,
    policyNumber: { type: String, required: true },
    productName: String,
    policyPeriod: String,
    tenure: String
}, { timestamps: true });

module.exports = mongoose.model("CustomerPolicy", CustomerPolicySchema);
