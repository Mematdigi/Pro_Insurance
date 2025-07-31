const Customer = require("../models/Customer");
const pdf = require("pdf-parse");
const CustomerPolicy = require("../models/CustomerPolicy");
const CustomerInsuredMembers = require("../models/CustomerInsuredMembers");


// ✅ Polyfill DOMMatrix BEFORE requiring pdfjs-dist
if (typeof global.DOMMatrix === "undefined") {
    global.DOMMatrix = class {
        constructor() {
            this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
        }
    };
}


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

        // ✅ Extract text using pdf-parse
        const pdfBuffer = req.file.buffer;
        const pdfData = await pdf(pdfBuffer);
        let rawExtractedText = pdfData.text.replace(/\r/g, "");
        const lines = rawExtractedText.split("\n").map(line => line.trim()).filter(l => l !== "");

        // ---- Extract Policy Holder Details ----
        const nameIndex = lines.findIndex(line => /^[A-Z\s]+$/.test(line) && line.includes("YASH MITTAL"));
        const policyHolderName = nameIndex !== -1 ? lines[nameIndex] : "";
        let policyHolderAddress = "", phoneNumber = "", policyNumber = "", productName = "", policyPeriod = "";

        if (nameIndex !== -1) {
            let i = nameIndex + 1;
            const addressParts = [];
            while (i < lines.length) {
                const line = lines[i];
                if (/^\d{10}$/.test(line)) { phoneNumber = line; break; }
                addressParts.push(line); i++;
            }
            policyHolderAddress = addressParts.join(" ").trim();

            for (let j = i + 1; j < lines.length; j++) {
                if (/^\d{10,12}(\s?\d{0,2})?$/.test(lines[j])) {
                    policyNumber = lines[j].trim();
                    if (lines[j + 1]) productName = lines[j + 1].trim();
                    for (let k = j + 2; k < lines.length; k++) {
                        if (lines[k].startsWith("From")) {
                            policyPeriod = (lines[k] + " " + lines[k + 1]).replace(/\n/g, " ").trim();
                            break;
                        }
                    }
                    break;
                }
            }
        }

        const tenureMatch = rawExtractedText.match(/(\d+\s+Year)(?!.*Renewal\s+Business)/i);
        const policyTenure = tenureMatch ? tenureMatch[1].trim() : "";

        // ---- Extract Insured Members ----
        const cleanedText = rawExtractedText.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
        const insuredMembers = [];
        const insuredSectionMatch = cleanedText.match(/Insured Persons Details\s*:(.*?)(?=Nominee Details|Benefits table|$)/i);

        if (insuredSectionMatch) {
            const insuredSection = insuredSectionMatch[1].trim();
            const personRegex = /(0YAMI\d+)\s+\d{4}\s+.*?(?=(?:0YAMI\d+|$))/g;
            const personMatches = insuredSection.match(personRegex);

            if (personMatches) {
                personMatches.forEach(entry => {
                    const memberIdMatch = entry.match(/(0YAMI\d+)\s+(\d{4})/);
                    const memberId = memberIdMatch ? memberIdMatch[1] : "";
                    const code = memberIdMatch ? memberIdMatch[2] : "";
                    const dates = entry.match(/\d{2}\/\d{2}\/\d{4}/g) || [];
                    const startDate = dates[0] || "";
                    const dob = dates[1] || "";
                    const ageMatch = entry.match(/\d{2}\/\d{2}\/\d{4}(\d{2})[A-Za-z]/);
                    const age = ageMatch ? ageMatch[1] : "";
                    const relExtract = entry.match(/\d{2}([A-Za-z]+)/);
                    const relationship = relExtract ? relExtract[1] : "";
                    const sumMatch = entry.match(/(\d{1,3}(?:,\d{3})*\.\d{2})/g);
                    const sumInsured = sumMatch ? sumMatch[sumMatch.length - 1] : "";
                    const nameSection = entry.substring(entry.indexOf(code) + code.length, entry.indexOf(startDate)).trim();
                    const insuredName = nameSection.replace(/\d+/g, "").trim();

                    insuredMembers.push({
                        customerId,
                        policyNumber,
                        memberId,
                        code,
                        insuredName,
                        startDate,
                        dob,
                        age,
                        relationship,
                        sumInsured
                    });
                });
            }
        }

        // ✅ Save Policy Holder into CustomerPolicy
        const policyHolder = new CustomerPolicy({
            customerId,
            policyHolderPhone: phoneNumber,
            policyHolderName,
            policyHolderAddress,
            policyNumber,
            productName,
            policyPeriod,
            tenure: policyTenure
        });
        await policyHolder.save();

        // ✅ Save Insured Members into CustomerInsuredMembers
        if (insuredMembers.length > 0) {
            await CustomerInsuredMembers.insertMany(insuredMembers);
        }

        return res.json({
            message: "PDF processed and saved successfully",
            policyHolder,
            insuredMembers
        });

    } catch (error) {
        console.error("❌ Error in handlePDFUpload:", error.message);
        console.error(error.stack);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

getCustomerPolicy = async (req, res) => {
    try {
        const { customerId } = req.params;

        // ✅ Validate customer existence
        const customer = await Customer.findById(customerId);
        if (!customer) return res.status(404).json({ error: "Customer not found" });

        // ✅ Fetch customer policy
        const policyData = await CustomerPolicy.findOne({ customerId });

        if (!policyData) {
            return res.status(404).json({ message: "No policy found for this customer" });
        }

        return res.json({
            message: "Customer policy fetched successfully",
            policyData
        });

    } catch (error) {
        console.error("❌ Error in getCustomerPolicy:", error.message);
        console.error(error.stack);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

getCustomerInsuredMembers = async (req, res) => {
    try {
        const { customerId } = req.params;

        // ✅ Validate customer existence
        const customer = await Customer.findById(customerId);
        if (!customer) return res.status(404).json({ error: "Customer not found" });

        // ✅ Fetch insured members for this customer
        const insuredMembers = await CustomerInsuredMembers.find({ customerId });

        if (!insuredMembers || insuredMembers.length === 0) {
            return res.status(404).json({ message: "No insured members found for this customer" });
        }

        return res.json({
            message: "Customer insured members fetched successfully",
            insuredMembers
        });

    } catch (error) {
        console.error("❌ Error in getCustomerInsuredMembers:", error.message);
        console.error(error.stack);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

}

module.exports = new CustomerController();
