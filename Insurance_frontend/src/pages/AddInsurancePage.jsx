import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

// ✅ Vite-compatible way to load PDF worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;


const AddInsurancePage = () => {
 const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
          <div className="add-policy-card mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="fw-semibold mb-1">Add New Insurance Policy</h4>
                <p className="text-muted mb-3">Choose your preferred method to add a new policy</p>
              </div>
              <div className="fs-4 text-primary fw-bold">＋</div>
            </div>

            <div className="row g-3">
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

          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInsurancePage;
