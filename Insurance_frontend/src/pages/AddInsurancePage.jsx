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
  const [manualForm, setManualForm] = useState(false);
  const [showStepForm, setShowStepForm] = useState(false); // ✅ NEW STATE for Add Insurance Form
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
        <div className="page-body d-flex flex-column align-items-center">

          {/* ✅ Show Manual Form if clicked */}
          {manualForm ? (
            <div className="card p-4 rounded-4 shadow-sm mt-4" style={{ background: "#f8fbff", width: "100%", maxWidth: "700px" }}>
              <h4 className="fw-bold text-primary mb-4">Primary Policy Holder Details</h4>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Policy Holder Name *</label>
                  <input type="text" className="form-control" placeholder="Enter Name" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Policy Holder Phone *</label>
                  <input type="text" className="form-control" placeholder="Enter Phone" />
                </div>
                <div className="col-12">
                  <label className="form-label">Policy Holder Address *</label>
                  <textarea className="form-control" rows="2" placeholder="Enter Address"></textarea>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Policy Number *</label>
                  <input type="text" className="form-control" placeholder="Enter Policy Number" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Product Name *</label>
                  <input type="text" className="form-control" placeholder="Enter Product Name" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Policy Start Date *</label>
                  <input type="date" className="form-control" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Policy End Date *</label>
                  <input type="date" className="form-control" />
                </div>
                <div className="col-12">
                  <label className="form-label">Tenure *</label>
                  <select className="form-select">
                    <option value="">Select tenure</option>
                    <option value="1 Year">1 Year</option>
                    <option value="2 Years">2 Years</option>
                    <option value="3 Years">3 Years</option>
                  </select>
                </div>
              </div>
              <div className="d-flex justify-content-end mt-4">
                <button className="btn btn-secondary me-2" onClick={() => setManualForm(false)}>Cancel</button>
                <button className="btn btn-primary">Submit</button>
              </div>
            </div>
          ) : showStepForm ? (
            <>
              {/* ✅ Step Progress Bar */}
              <div className="step-progress mb-5 mt-5" style={{ width: "100%", maxWidth: "700px" }}>
                <div className="d-flex justify-content-between align-items-center position-relative">
                  {["Company", "Policy No.", "Upload"].map((label, index) => (
                    <div key={index} className="text-center flex-fill position-relative">
                      {index > 0 && <div className="progress-line"></div>}
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

              {/* ✅ Step 1: Select Company */}
              {step === 1 && (
                <div className="card p-4 rounded-4 shadow-sm mt-4" style={{ maxWidth: "600px", width: "100%" }}>
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

              {/* ✅ Step 2: Policy No */}
              {step === 2 && (
                <div className="card p-4 rounded-4 shadow-sm mt-4" style={{ maxWidth: "600px", width: "100%" }}>
                  <h5 className="fw-bold mb-3">Step 2: Policy No.</h5>
                  <label className="form-label">Enter Policy Number</label>
                  <input className="form-control" value={policyNumber} onChange={(e) => setPolicyNumber(e.target.value)} placeholder="Enter your policy number" />
                  <small className="text-muted mt-2 d-block">You can also skip and add later from the dashboard.</small>
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <button className="btn btn-outline-secondary" onClick={() => setStep(1)}>← Back</button>
                    <div>
                      <button className="btn btn-outline-secondary me-2" onClick={() => setStep(3)}>Skip</button>
                      <button className="btn btn-primary" onClick={() => setStep(3)}>Next →</button>
                    </div>
                  </div>
                </div>
              )}

              {/* ✅ Step 3: Upload */}
              {step === 3 && (
                <div className="card p-4 rounded-4 shadow-sm mt-4" style={{ maxWidth: "700px", width: "100%" }}>
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
            </>
          ) : (
            /* ✅ Show Both Cards Initially */
            <div className="d-flex flex-wrap justify-content-center gap-4 mt-4 w-100">
              {/* Add New Insurance Card */}
              <div className="add-policy-start text-center rounded-4 shadow-sm d-flex flex-column align-items-center justify-content-center p-4"
                style={{ flex: "1 1 300px", maxWidth: "400px", height: "350px" }}>
                <div className="circle-icon d-flex align-items-center justify-content-center mb-4"
                  style={{ width: "80px", height: "80px", backgroundColor: "#007bff", borderRadius: "50%" }}>
                  <span style={{ fontSize: "2rem", color: "#fff" }}>＋</span>
                </div>
                <h4 className="fw-bold mt-2">Upload Insurance</h4>
                <p className="text-muted mb-4 text-center">Add a new insurance policy to your dashboard in just <br /> 3 simple steps.</p>
                <button className="btn btn-primary btn-lg px-4 fw-semibold" onClick={() => { setStep(1); setShowStepForm(true); }}>Get Started</button>
              </div>

              {/* Add Manual Insurance Card */}
              <div className="manual-form-box text-center rounded-4 shadow-sm d-flex flex-column align-items-center justify-content-center p-4"
                style={{ flex: "1 1 300px", maxWidth: "400px", height: "350px", backgroundColor: "#dc3545", color: "#fff" }}>
                <div className="circle-icon d-flex align-items-center justify-content-center mb-4"
                  style={{ width: "80px", height: "80px", backgroundColor: "#fff", borderRadius: "50%" }}>
                  <span style={{ fontSize: "2rem", color: "#dc3545" }}>＋</span>
                </div>
                <h4 className="fw-bold mt-2">Add Manually</h4>
                <p className="mb-4 text-center">Manually add a new insurance policy by filling in all details yourself.</p>
                <button className="btn btn-light btn-lg px-4 fw-semibold" onClick={() => setManualForm(true)}>Get Started</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddInsurancePage;
