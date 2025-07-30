const Customer = require("../models/Customer");
const PolicyCustomer = require('../models/CustomerPolicy');

// ✅ Polyfill DOMMatrix BEFORE requiring pdfjs-dist
if (typeof global.DOMMatrix === "undefined") {
    global.DOMMatrix = class {
        constructor() {
            this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
        }
    };
}

const pdfjsLib = require('pdfjs-dist');

class CustomerController {

    // GET /api/customers/:id
getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/customers/:id
updateCustomer = async (req, res) => {
  try {
    const { email, address, dob } = req.body;
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { email, address, dob },
      { new: true }
    );
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

handlePDFUpload = async (req, res) => {
    try {
        const { customerId } = req.params;

        // ✅ Validate customer existence
        const customer = await Customer.findById(customerId);
        if (!customer) return res.status(404).json({ error: "Customer not found" });

        if (!req.file) return res.status(400).json({ error: "No PDF file uploaded. Use 'file' as key." });

        const pdfData = new Uint8Array(req.file.buffer);
        const loadingTask = pdfjsLib.getDocument({ data: pdfData });
        const pdfDoc = await loadingTask.promise;

        // ✅ Extract text from PDF
        let rawExtractedText = "";
        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);
            const textContent = await page.getTextContent();
            rawExtractedText += textContent.items.map(item => item.str).join(" ") + "\n";
        }
        rawExtractedText = rawExtractedText.replace(/\s+/g, " ").trim();

        // ✅ Locate marker line (start of relevant section)
        const startMarker = /Intermediary name Intermediary code Intermediary contact no\. Client Id Proposal no Policy holder’s name Policy holder’s address Policy Number Product name Plan type Policy period Business Type Policy Tenure/i;
        const startIndex = rawExtractedText.search(startMarker);
        if (startIndex === -1) return res.status(400).json({ error: "Required marker line not found in PDF" });

        const dataBlock = rawExtractedText.substring(startIndex);

        // ✅ Intermediary Name
        const intermediaryName = dataBlock.match(/Intermediary name\s*:?\s*([A-Za-z\s]+)/i)?.[1]?.trim() || "";

        // ✅ Intermediary Code
        const intermediaryCode = dataBlock.match(/Intermediary code\s*:?\s*([A-Z0-9]+)/i)?.[1]?.trim() || "";

        // ✅ Intermediary Contact (first phone number after marker)
        const phoneMatch = dataBlock.match(/\b\d{10}\b/);
        const policyHolderPhone = phoneMatch ? phoneMatch[0] : "";

        // ✅ Policy Holder Name
        let policyHolderName = "";
        if (policyHolderPhone) {
            const phoneIndex = dataBlock.indexOf(policyHolderPhone);
            const afterPhone = dataBlock.substring(phoneIndex);
            const nameMatch = afterPhone.match(/\(\s*mobile or landline\s*\)\s*:?(\s*:)*\s*[0-9]+\s+[A-Z0-9]+\s+([A-Z\s]+)/i);
            if (nameMatch) policyHolderName = nameMatch[2].trim();
        }

        // ✅ Policy Holder Address
        let policyHolderAddress = "";
        if (policyHolderName) {
            const nameIndex = dataBlock.indexOf(policyHolderName);
            const afterName = dataBlock.substring(nameIndex + policyHolderName.length).trim();
            const addressMatch = afterName.match(/([\w\s,.-]+?)\s+\b\d{10}\b/);
            if (addressMatch) policyHolderAddress = addressMatch[1].trim();
        }

        // ✅ Policy Number → Product Name → Policy Period → Tenure
        let policyNumber = "";
        let productName = "";
        let policyPeriod = "";
        let tenure = "";

        if (policyHolderAddress) {
            const addressIndex = dataBlock.indexOf(policyHolderAddress);
            const afterAddress = dataBlock.substring(addressIndex + policyHolderAddress.length).trim();
            const nextPhoneMatch = afterAddress.match(/\b\d{10}\b/);
            if (nextPhoneMatch) {
                const phoneAfterAddressIndex = afterAddress.indexOf(nextPhoneMatch[0]);
                const afterPhone2 = afterAddress.substring(phoneAfterAddressIndex + nextPhoneMatch[0].length).trim();

                // ✅ Extract Policy Number
                const policyMatch = afterPhone2.match(/([0-9]{6,}\s*\d{0,2})/);
                if (policyMatch) {
                    policyNumber = policyMatch[1].trim();

                    // ✅ Extract Product Name (skip Floater Basis)
                    const policyIndex = afterPhone2.indexOf(policyNumber);
                    const afterPolicy = afterPhone2.substring(policyIndex + policyNumber.length).trim();
                    const productMatch = afterPolicy.match(/([A-Z][A-Za-z\s]+(?:AIG)?\s+[A-Za-z]+\s+[A-Za-z]+)(?=\s+Floater Basis)/i);
                    if (productMatch) productName = productMatch[1].trim();

                    // ✅ Extract Policy Period
                    const periodMatch = afterPolicy.match(/From\s+\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}\s+hrs\s+to\s+\d{2}\/\d{2}\/\d{4}\s+on\s+\d{2}:\d{2}\s+PM/i);
                    if (periodMatch) policyPeriod = periodMatch[0].trim();

                    // ✅ Extract Tenure (skip Renewal Business)
                    const tenureMatch = afterPolicy.match(/(\d+\s+Year)(?!.*Renewal\s+Business)/i);
                    if (tenureMatch) tenure = tenureMatch[1].trim();
                }
            }
        }

        // ✅ Insured Persons Extraction
        const insuredPersons = [];
        const insuredRegex = /Insured Persons Details\s*:([\s\S]*?)(?=\*For Family Floater|Nominee Details)/i;
        const insuredMatch = rawExtractedText.match(insuredRegex);
        if (insuredMatch) {
            const insuredBlock = insuredMatch[1].trim();
            const personRegex = /([A-Z0-9]+)\s+\d+\s+([A-Z\s]+)\s+(\d{2}\/\d{2}\/\d{4})\s+\d{2}\/\d{2}\/\d{4}\s+(\d+)\s+(\w+)\s+([\d,]+\.?\d*)/gi;
            let match;
            while ((match = personRegex.exec(insuredBlock)) !== null) {
                insuredPersons.push({
                    memberId: match[1].trim(),
                    insuredName: match[2].trim(),
                    dob: match[3].trim(),
                    age: match[4].trim(),
                    relationship: match[5].trim(),
                    sumInsured: match[6].trim()
                });
            }
        }

        // ✅ Final Response
        const extractedData = {
            customerId,
            intermediaryName,
            intermediaryCode,
            policyHolderPhone,
            policyHolderName,
            policyHolderAddress,
            policyNumber,
            productName,
            policyPeriod,
            tenure, // ✅ Now included
            insuredPersons
        };

        console.log("✅ Extracted Data:", extractedData);
        return res.json({ message: "PDF processed successfully", extractedData });

    } catch (error) {
        console.error("❌ PDF Processing Failed:", error);
        res.status(500).json({ error: "PDF Processing Failed" });
    }
};


}

module.exports = new CustomerController();
