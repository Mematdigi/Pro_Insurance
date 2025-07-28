import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

// Load PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const AddInsurancePage = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [uploading, setUploading] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const reader = new FileReader();
    reader.onload = async function () {
      const typedArray = new Uint8Array(this.result);
      try {
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map(item => item.str);
          fullText += strings.join(" ");
        }

        const extract = (label) => {
          const regex = new RegExp(`${label}:\\s*(.*?)\\s(?=\\w+:|$)`, 'i');
          const match = fullText.match(regex);
          return match ? match[1].trim() : '';
        };

        const extracted = {
          policyHolderName: extract("Policy Holder Name"),
          policyId: extract("Policy ID"),
          address: extract("Address"),
          contact: extract("Contact"),
          email: extract("Email"),
          dob: extract("DOB"),
          gender: extract("Gender"),
          sumAssured: extract("Sum Assured"),
          dueDate: extract("Due Date"),
          maturityDate: extract("Maturity Date"),
          paymentType: extract("Payment Type")
        };

        localStorage.setItem('latestPolicy', JSON.stringify(extracted));
        alert("Policy data extracted and saved to My Policies Page");
      } catch (err) {
        console.error("PDF Parsing Error:", err);
        alert("Failed to parse the PDF");
      } finally {
        setUploading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      {sidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}

      <div className="main-content">
        <div className="page-body">
          {/* Step 0: Start Card */}
          {step === 0 && (
            <div className="add-policy-start text-center p-5 border border-primary-subtle rounded-4 shadow-sm mt-4" style={{ maxWidth: '400px' }}>
              <div className="circle-icon mb-3">
                <div className="bg-primary text-white d-inline-flex justify-content-center align-items-center rounded-circle" style={{ width: 60, height: 60 }}>
                  <span style={{ fontSize: '2rem' }}>＋</span>
                </div>
              </div>
              <h4 className="fw-bold">Add New Insurance</h4>
              <p className="text-muted mb-4">
                Add a new insurance policy to your dashboard in just <br /> 3 simple steps.
              </p>
              <button className="btn btn-primary btn-lg px-5 fw-semibold" onClick={() => setStep(1)}>
                Get Started
              </button>
            </div>
          )}

          {/* Step Progress Bar */}
         {step > 0 && (
  <div className="step-progress mb-5 mt-5">
    <div className="d-flex justify-content-between align-items-center position-relative">
      {["Company", "Policy No.", "Upload"].map((label, index) => (
        <div key={index} className="text-center flex-fill position-relative">
          {/* Line connector except first */}
          {index > 0 && (
            <div className="progress-line"></div>
          )}
          <div className={`step-circle ${step > index ? 'completed' : step === index ? 'active' : ''}`}>
            {step > index ? <i className="bi bi-check2"></i> : index + 1}
          </div>
          <div className="fw-semibold mt-2">{label}</div>
          <div className="text-muted small">
            {index === 0 ? "Select insurance provider" :
              index === 1 ? "Enter policy number" : "Upload documents"}
          </div>
        </div>
      ))}
    </div>
  </div>
)}


          {/* Step 1: Select Company */}
          {step === 1 && (
            <div className="card p-4 rounded-4 shadow-sm mt-5">
              <h5 className="fw-bold mb-3">Step 1: Company</h5>
              <label className="form-label">Select Insurance Company <span className="text-danger">*</span></label>
              <select className="form-select" value={selectedCompany} onChange={e => setSelectedCompany(e.target.value)}>
                <option value="">Choose from list...</option>
                <option value="LIC">LIC</option>
                <option value="HDFC">HDFC</option>
                <option value="Tata AIG">Tata AIG</option>
              </select>
              <div className="d-flex justify-content-end mt-4">
                <button className="btn btn-primary" onClick={() => setStep(2)} disabled={!selectedCompany}>Next →</button>
              </div>
            </div>
          )}

          {/* Step 2: Policy No */}
          {step === 2 && (
            <div className="card p-4 rounded-4 shadow-sm mt-5">
              <h5 className="fw-bold mb-3">Step 2: Policy No.</h5>
              <label className="form-label">Enter Policy Number <i className="bi bi-question-circle ms-1 text-muted"></i></label>
              <input className="form-control" value={policyNumber} onChange={(e) => setPolicyNumber(e.target.value)} placeholder="Enter your policy number" />
              <small className="text-muted mt-2 d-block">Don’t worry, you can always add your policy number later from your dashboard.</small>
              <div className="d-flex justify-content-between align-items-center mt-4">
                <button className="btn btn-outline-secondary" onClick={() => setStep(1)}>← Back</button>
                <div>
                  <button className="btn btn-outline-secondary me-2" onClick={() => setStep(3)}>Skip</button>
                  <button className="btn btn-primary" onClick={() => setStep(3)}>Next →</button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Upload */}
          {step === 3 && (
            <div className="card p-4 rounded-4 shadow-sm mt-5">
              <h5 className="fw-bold mb-3">Step 3: Upload</h5>
              <p className="text-muted mb-4">Choose your preferred method to upload your insurance policy</p>
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="upload-box upload-image text-center p-4 rounded-4 h-100">
                    <i className="bi bi-camera-fill fs-1 text-primary mb-3"></i>
                    <h5 className="fw-bold">Upload Image</h5>
                    <p className="text-muted small mb-2">Capture or upload your insurance document photo</p>
                    <a href="#" className="text-decoration-none fw-medium small">📁 Click to browse</a>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="upload-box upload-pdf text-center p-4 rounded-4 h-100">
                    <i className="bi bi-file-earmark-pdf-fill fs-1 text-danger mb-3"></i>
                    <h5 className="fw-bold">Import PDF</h5>
                    <p className="text-muted small mb-2">Upload your complete insurance policy document</p>
                    <label className="text-decoration-none fw-medium small" style={{ cursor: "pointer" }}>
                      📄 Select PDF file
                      <input type="file" accept="application/pdf" onChange={handlePDFUpload} style={{ display: "none" }} />
                    </label>
                    {uploading && <div className="mt-2 text-primary small">Uploading...</div>}
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-4">
                <button className="btn btn-outline-secondary" onClick={() => setStep(2)}>← Back</button>
                <button className="btn btn-success">Complete Setup</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddInsurancePage;
