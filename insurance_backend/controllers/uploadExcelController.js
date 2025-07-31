const XLSX = require("xlsx");
const fs = require("fs");
const Policy = require("../models/AgentPolicies");
const  mongoose  = require("mongoose");  

const uploadExcelController = async (req, res) => {
  try {
    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    const agentId = req.body.agentId;
    const agentCode = req.body.agentCode || "manual";

    if (!agentId) return res.status(400).json({ msg: "Agent ID is missing" });

    const policies = rows
  .filter((row) => row['Premium'] && !isNaN(row['Premium'])) // ✅ Filter invalid rows
  .map((row) => {
    const sumInsured = Number(row['Sum Insured']);
    const premium = Number(row['Premium']);

    return {
      agentId,
      agentCode,

      customerName: row['Customer Name'] || "Unknown",
      customerPhone: row['Contact Number'] || "0000000000",
      customerEmail: row['Email'] || "",
      customerDOB:  row['DOB'], // Added for DOB

      company: row['Company'] || row["Company Name"] || "Unknown",
      insuranceType: row['Insurance Category'] ,
      policyType: row['Policy Type'] ,
      policyNumber: row["Policy Number"] || `POL-${Date.now()}`,

      policyDetails:{
        sumInsured: isNaN(sumInsured) ? 0 : sumInsured,
        premium: isNaN(premium) ? 0 : premium,
        startDate: row["Start Date"] || new Date().toISOString().split("T")[0],
        endDate: row["Due Date"] || row["End Date"] || new Date().toISOString().split("T")[0],
      },
    };
  });


/*    const policies = rows.map((row) => {
      const policy = {
        userId: row["CustomerID"] || `Excel-${Date.now()}`, // fallback
        agentId: new mongoose.Types.ObjectId(agentId),
        agentCode,
        company: row["Insurance Company"],
        policyType: row["Insurance Type"],
        policyNumber: row["Customer Name"] + "-" + row["Contact Number"],
        policyDetails: {
          sumInsured: Number(row["Sum Insured"]),
          premium: Number(row["Premium Amount"]),
          startDate: row["Start Date"],
          endDate: row["Due Date"],
        },
      };
      return policy;
    });
*/  
    if (policies.length === 0) {
      return res.status(400).json({ msg: "No valid policies to import." });
  }

    console.log("✅ Cleaned policies ready to save:", policies);
    const saved = await Policy.insertMany(policies);
    fs.unlinkSync(filePath); // clean up file

    res.status(200).json({ msg: "Excel data saved", policies: saved });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ msg: "Excel processing failed" });
  }
};

module.exports = uploadExcelController;
