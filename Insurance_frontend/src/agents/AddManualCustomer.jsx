import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddManualCustomer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
	dob:"",
	policyId:"",
	contact: "",
    email: "",
    company: "",
    category: "",
    type: "",
    premium: "",
	paymentMode: "Yearly",
    startDate: "",
    maturityDate: "",
    nomineeName: "",
    nomineeRelation: "",
    branchName: "",					  
    
  });

  const insuranceOptions = {
    "Life Insurance": [
      "Term",
      "Whole Life",
      "Endowment",
      "Money-Back",
      "ULIP",
      "Child",
      "Pension",
    ],
    "General Insurance": [
      "Health",
      "Motor",
      "Travel",
      "Home",
      "Fire",
      "Marine",
      "Personal Accident",
      "Commercial",
    ],
  };

  const insuranceCompanies = [
    "LIC",
    "HDFC Life",
    "SBI Life",
    "ICICI Prudential Life",
    "Max Life",
    "New India Assurance",
    "ICICI Lombard",
    "Bajaj Allianz General",
    "Tata AIG",
    "HDFC ERGO",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      setFormData((prev) => ({
        ...prev,
        category: value,
        type: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  const getNextDueDate = (startDate, paymentMode) => {
  const date = new Date(startDate);
  if (paymentMode === "Monthly") date.setMonth(date.getMonth() + 1);
  else if (paymentMode === "Quarterly") date.setMonth(date.getMonth() + 3);
  else if (paymentMode === "Half-Yearly") date.setMonth(date.getMonth() + 6);
  else if (paymentMode === "Yearly") date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
};
  const handleSubmit = async (e) => {
  e.preventDefault();
  
  const agent = JSON.parse(localStorage.getItem("user"));
  const dueDate = getNextDueDate(formData.startDate, formData.paymentMode); // ✅ add this line
  if (!agent || !agent.id) {
    alert("Agent not logged in. Please log in again.");
    return;
  }

  const payload = {
    agentId: agent.id,
    agentCode: "manual123",
	  name: formData.name,
    dob: formData.dob,
    contact: formData.contact,
    email: formData.email,
    company: formData.company,
    policies: [
      {
        policyId: formData.policyId,
        category: formData.category,
        policyType: formData.type,
        premium: formData.premium,
        paymentMode: formData.paymentMode,
        startDate: formData.startDate,
        maturityDate: formData.maturityDate,
        nomineeName: formData.nomineeName,
        nomineeRelation: formData.nomineeRelation,
        branchName: formData.branchName,
        dueDate, // ✅ include here
      },
    ],
  };

  console.log("📤 Submitting manual policy:", payload);
  try {
    const res = await fetch("http://localhost:5000/api/agent/manual-policy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Policy saved.");
      navigate("/agent/companies");
    } else {
      alert("❌ " + (data.msg || "Something went wrong"));
    }
  } catch (err) {
    console.error("Manual policy error:", err);
    alert("❌ Failed to submit policy.");
  }
};
  
  return (
    <div className="container py-5">
      <div className="d-flex align-items-center mb-4 gap-4">
		<i className="bi bi-arrow-left text-muted" role="button" onClick={() => navigate(-1)}></i>
		<div>
          <h3 className="fw-bold mb-0">Add New Policy</h3>
		  <p className="text-muted small mb-0">Fill in the customer and insurance details</p>
		</div>
      </div>
	  <div className="d-flex gap-4">
        {/* Main Form */}
        <form onSubmit={handleSubmit} className="p-5 bg-white rounded shadow-sm w-75">
          <div className="row">
            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">Customer Name</label>
              <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
            </div>

            {/* ✅ DOB field */}
            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">Date of Birth</label>
              <input type="date" name="dob" className="form-control" value={formData.dob} onChange={handleChange} required />
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">Policy Number</label>
              <input type="text" name="policyId" className="form-control" value={formData.policyId} onChange={handleChange} required />
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">Contact Number</label>
              <input type="text" name="contact" className="form-control" value={formData.contact} onChange={handleChange} required />
            </div>

            <div className="col-md-6 mb-4">
										 
              <label className="form-label fw-semibold">Email Address</label>
              <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange}  required />
			  
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">Insurance Company</label>
              <select name="company" className="form-select" value={formData.company} onChange={handleChange} required>
                <option value="">Select insurance company</option>
                {insuranceCompanies.map((comp, index) => (
                  <option key={index} value={comp}>{comp}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">Insurance Category</label>
              <select name="category" className="form-select" value={formData.category} onChange={handleChange} required>
                <option value="">Select category</option>
                {Object.keys(insuranceOptions).map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
 
              </select>
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">Insurance Type</label>
              <select name="type" className="form-select" value={formData.type} onChange={handleChange} disabled={!formData.category} required>
                <option value="">Select type</option>
								   
                {formData.category && insuranceOptions[formData.category].map((t, i) => (
                  <option key={i} value={t}>{t}</option>
						  
						   
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">Premium Amount</label>
              <input type="number" name="premium" className="form-control" value={formData.premium} onChange={handleChange} required />
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">Payment Mode</label>
              <select name="paymentMode" className="form-select" value={formData.paymentMode} onChange={handleChange} required >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Half-Yearly">Half-Yearly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">Premium Start Date</label>
              <input type="date" name="startDate" className="form-control" value={formData.startDate} onChange={handleChange} required />
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">Maturity Date</label>
              <input type="date" name="maturityDate" className="form-control" value={formData.maturityDate} onChange={handleChange}  required />
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">Nominee Name</label>
              <input type="text" name="nomineeName" className="form-control" value={formData.nomineeName} onChange={handleChange}  required />
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">Nominee Relation</label>
              <input type="text" name="nomineeRelation" className="form-control" value={formData.nomineeRelation} onChange={handleChange}  required />
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">Branch Name</label>
              <input type="text" name="branchName" className="form-control" value={formData.branchName} onChange={handleChange}  required />
            </div>
			  
          </div>

          <div className="text-center pt-4">
            <button type="submit" className="btn btn-primary px-5 py-2">Add Customer</button>
          </div>
        </form>

        {/* Quick Actions */}
        <div className="w-25">
          <div className="bg-white rounded shadow-sm p-4">
            <h5 className="fw-bold mb-4">Quick Actions</h5>
            <div className="d-grid gap-3">
              <button className="btn btn-outline-success d-flex align-items-center gap-2" onClick={() => navigate("/add-family")}>
                <i className="bi bi-person-plus-fill"></i> Add Family
              </button>
              <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={() => navigate("/family-history")}>
                <i className="bi bi-journal-text"></i> Family History
              </button>
              <button className="btn btn-outline-primary d-flex align-items-center gap-2" onClick={() => navigate("/medical-history")}>
                <i className="bi bi-heart-pulse-fill"></i> Medical History
              </button>
              
            </div>
          </div>
        </div>
				   
      </div>
			 
    </div>
  );
};

export default AddManualCustomer;

