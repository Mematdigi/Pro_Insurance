const Customer = require("../models/Customer");
const PdfParse = require('pdf-parse');
const fs = require('fs');
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

// POST /api/pdf-reader
handlePDFUpload = async (req, res) => {
    //read buffer file
    let dataBuffer = fs.readFileSync('./pdf_template/file4.pdf');
    //parse pdf
    PdfParse(dataBuffer).then(async (data) => {
        const text = data.text;
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const email = text.match(emailRegex);


        const Name = "suraj"
        console.log("Name:", Name);
        
        const phoneRegex = /(?:\+?\d{1,3}[\s-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}/g;

        // Extract phone numbers
        
        const phoneNumbers = data.text.match(phoneRegex);

        // Extract Education deatils

          const educationRegex = /(?:education|educational background|academic qualifications)[\s\S]{0,500}?(?=\n{2,}|\bexperience\b|\bskills\b|\bprojects\b|\bcertifications\b|\bwork\b|\bprofessional\b|\btechnical\b|$)/i;

            const education = text.match(educationRegex);

        // Extract Techinical skills
          const skillsRegex = /(?:technical skills|skills|technologies)[\s\S]{0,500}?(?=\n{2,}|\beducation\b|\bexperience\b|\bprojects\b|$)/i;
            const skills = text.match(skillsRegex);

            //Certification
const certSectionRegex = /\b(certifications?|certificates?|certificate?|licenses?|licences?|credentials?)\b\s*[:\-]?\s*([\s\S]*?)(?=\n{2,}|\b(skills|education|experience|projects)\b|$)/i;
const certSectionMatch = text.match(certSectionRegex);
const certifications = certSectionMatch ? certSectionMatch[2].trim() : null;

        try {   
            await client.connect();
            const database = client.db("local");
            const collection = database.collection("candidate_list_table");

            const result = await collection.insertOne({ name: `${Name}`, email: `${email}`,phone : `${phoneNumbers}`,education:`${education}` ,skills:`${skills}`,Certificate:`${certifications}` });
            console.log(`A document was inserted with the _id: ${result.insertedId}`);

            const documents = await collection.find({}).toArray();
            res.send(documents);

        } finally {
            await client.close();
        }


    })
        .catch(function (error) {
            console.log(error)
        })
}

}

module.exports = new CustomerController();