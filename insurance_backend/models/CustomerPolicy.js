const mongoose = require('mongoose');

const PolicyCustomerSchema = new mongoose.Schema({
    customerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Customer', 
        required: true 
    },
    intermediaryName: String,
    intermediaryCode: String,
    intermediaryContactNo: String,
    issuingOffice: String,
    clientId: String,
    proposalNo: String,
    policyHolderName: String,
    policyHolderAddress: String,
    insuredGSTNo: String,
    placeOfSupply: String,
    supplyCode: String,
    premiumPaymentZone: String,
    policyNumber: String,
    productName: String,
    planType: String,
    policyPeriod: String,
    businessType: String,
    policyTenure: String,
    rawExtractedText: String
}, { timestamps: true });

module.exports = mongoose.model('PolicyCustomer', PolicyCustomerSchema);
