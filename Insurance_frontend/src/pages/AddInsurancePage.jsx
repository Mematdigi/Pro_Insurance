import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const companies = [
  { name: "Life Insurance Corporation of India", icon: "🏛️", schemes: 16 },
  { name: "SBI Life Insurance", icon: "🏛️", schemes: 6 },
  { name: "HDFC Life", icon: "🏢", schemes: 8 },
  { name: "ICICI Lombard", icon: "🏪", schemes: 7 },
  { name: "ICICI Prudential Life", icon: "🏛️", schemes: 12 },
];

const types = [
  { name: "Term Assurance", desc: "Pure life cover with high sum assured", schemes: 4, icon: "🛡️" },
  { name: "Endowment/Savings", desc: "Insurance + Investment combined", schemes: 4, icon: "🐷" },
  { name: "ULIP", desc: "Unit Linked Insurance Plans", schemes: 2, icon: "📈" },
  { name: "Whole Life", desc: "Lifelong coverage", schemes: 2, icon: "❤️" },
  { name: "Child Plans", desc: "Secure your child’s future", schemes: 2, icon: "👶" },
  { name: "Pension/Retirement", desc: "Retirement planning solutions", schemes: 2, icon: "📅" },
];

const schemes = {
  "Endowment/Savings": [
    "Jeevan Anand",
    "Jeevan Labh",
    "Bima Bachat",
    "Jeevan Saral"
  ],
  "Term Assurance": ["Digi Term", "Yuva Term", "New Jeevan Amar"],
};

const AddInsurancePage = () => {
  const [step, setStep] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [formData, setFormData] = useState({ policyNo: "", startDate: "", sum: "", premium: "" });

  const navigate = useNavigate();

  const handleSubmit = () => {
    // save logic here (could be context, localStorage, or API)
    console.log({ selectedCompany, selectedType, selectedScheme, ...formData });
    navigate("/customer/dashboard"); // return to dashboard
  };

  return (
    <div className="add-insurance-page container py-4">
      {/* <button className="btn back-btn mb-3" onClick={() => navigate("/dashboard")}>← Back</button> */}

      {step === 1 && (
        <div className="step step1">
            <div className="header d-flex align-items-center mb-4">
            <button className="back-btn me-4" onClick={() => navigate("/customer/dashboard")}>←</button>
            <div>
                <h3 className="mb-0 fw-bold">Add Your Existing Insurance</h3>
                <p className="text-muted">Select your insurance company to get started</p>
            </div>
            </div>

            <div className="section">
            <h5 className="fw-semibold mb-3">
                🏛️ Choose Your Insurance Company
            </h5>
            <div className="row g-3">
                {companies.map((company, idx) => (
                <div className="col-12 col-md-6 col-lg-4" key={idx}>
                    <div
                    className="company-card p-3 h-100 rounded border shadow-sm"
                    onClick={() => {
                        setSelectedCompany(company);
                        setStep(2);
                    }}
                    style={{ cursor: "pointer", background: "#fff" }}
                    >
                    <div className="fs-3 mb-2">{company.icon}</div>
                    <div className="fw-semibold">{company.name}</div>
                    <div className="text-muted small">
                        {company.schemes} schemes available
                    </div>
                    </div>
                </div>
                ))}
            </div>
            </div>

            <div className="info-box bg-light p-3 mt-4 rounded border">
            <h6 className="fw-semibold mb-2">What happens next?</h6>
            <ul className="text-muted mb-0 small ps-3">
                <li>Select your insurance company from the options above</li>
                <li>Choose the type of insurance you have</li>
                <li>Select your specific insurance scheme</li>
                <li>Enter your policy details</li>
                <li>Your insurance will be added to your dashboard</li>
            </ul>
            </div>
        </div>
       )}


      {step === 2 && (
        <>
            <div className="step-header d-flex align-items-center gap-2 mb-3">
            <button className="btn btn-light back-btn" onClick={() => setStep(1)}>
                ←
            </button>
            <div>
                <h4 className="fw-bold mb-0 d-flex align-items-center gap-2">
                {selectedCompany.icon} {selectedCompany.name}
                </h4>
                <p className="text-muted small mb-0">Choose the type of insurance you have</p>
            </div>
            </div>

            <div className="available-types-wrapper">
            <h5 className="fw-semibold mb-3">
                <i className="bi bi-shield-check me-2"></i>
                Available Insurance Types
            </h5>

            <div className="grid-cards">
                {types.map((type) => (
                <div
                    className="card "
                    key={type.name}
                    onClick={() => {
                    setSelectedType(type);
                    setStep(3);
                    }}
                >
                    <div className="icon">{type.icon}</div>
                    <div className="name">{type.name}</div>
                    <div className="desc">{type.desc}</div>
                    <span className="badge">{type.schemes} schemes</span>
                </div>
                ))}
            </div>
            </div>

            <div className="mt-4">
            <div className="info-note text-center small text-muted border-top pt-3">
                Select an insurance type to see available schemes from <strong>{selectedCompany.name}</strong>
            </div>
            </div>
        </>
      )}


      {step === 3 && (
        <>
            <div className="step-header d-flex align-items-center gap-2 mb-3">
            <button className="btn btn-light back-btn" onClick={() => setStep(2)}>
                ←
            </button>
            <div>
                <h4 className="fw-bold mb-0 d-flex align-items-center gap-2">
                {selectedType.name}
                </h4>
                <p className="text-muted small mb-0">
                Choose your specific insurance scheme from {selectedCompany.name}
                </p>
            </div>
            </div>

            <div className="scheme-list-section mt-3">
            <h5 className="fw-semibold mb-3">
                <i className="bi bi-journal-text me-2"></i>
                Available Schemes
            </h5>

            <div className="list-group-schemes">
                {schemes[selectedType.name]?.map((scheme, idx) => (
                <div
                    key={idx}
                    className="scheme-item d-flex justify-content-between align-items-center mb-2"
                    onClick={() => {
                    setSelectedScheme(scheme);
                    setStep(4);
                    }}
                >
                    <div>
                    <strong>{scheme}</strong>
                    <div className="small text-muted">
                        {selectedCompany.name} • {selectedType.name}
                    </div>
                    </div>
                    <i className="bi bi-chevron-right text-muted"></i>
                </div>
                ))}
            </div>
            </div>

            <div className="mt-4">
            <div className="info-note text-center small text-muted border-top pt-3">
                Select a scheme to enter your policy details
            </div>
            </div>
        </>
      )}

     {step === 4 && (
  <>
    {/* Header Section */}
    <div className="step-header d-flex align-items-center gap-2 mb-3">
      <button className="btn btn-light back-btn" onClick={() => setStep(3)}>
        ←
      </button>
      <div>
        <h4 className="fw-bold mb-0">Policy Details</h4>
        <p className="text-muted small mb-0">Enter your policy information</p>
      </div>
    </div>

    {/* Selected Insurance Info */}
    <div className="selected-info-box bg-light p-3 rounded-3 border mb-4">
      <h6 className="fw-semibold mb-1">{selectedScheme}</h6>
      <p className="text-muted small mb-0">{selectedCompany.name} • {selectedType.name}</p>
    </div>

    {/* Form */}
    <div className="form-box p-4 border rounded-3 mb-3">
      <h5 className="fw-semibold mb-3">
        <i className="bi bi-file-earmark-text me-2"></i>Policy Information
      </h5>

      <div className="mb-3">
        <label className="form-label fw-semibold">Policy Number / Insurance ID <span className="text-danger">*</span></label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter your policy number"
          value={formData.policyNo}
          onChange={(e) => setFormData({ ...formData, policyNo: e.target.value })}
        />
      </div>

      {/* Buttons */}
      <div className="d-flex justify-content-between gap-2 mt-4">
        <button className="btn btn-outline-secondary " onClick={() => setStep(3)}>
          Back
        </button>
        <button className="btn btn-dark " onClick={handleSubmit}>
          ✓ Add Insurance
        </button>
      </div>
    </div>

    {/* Note */}
    <div className="alert alert-info mt-3 small" role="alert">
      📝 Your policy number is required to add the insurance to your dashboard. Other details are optional but help us provide better insights about your coverage.
    </div>
  </>
)}

    </div>
  );
};

export default AddInsurancePage;
