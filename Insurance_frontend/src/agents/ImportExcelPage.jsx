import React from "react";
import { useNavigate } from "react-router-dom";
import excelIcon from "/public/icons/excel-icon.jpg";

const ImportExcelPage = () => {
  const navigate = useNavigate();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const agent = JSON.parse(localStorage.getItem("user")); // ✅ Ensure user info is stored at login

    const formData = new FormData();
    formData.append("file", file);
    formData.append("agentId", agent.id);
    formData.append("agentCode", localStorage.getItem("agentCode") || "manual");

    try {
      const res = await fetch("http://localhost:5000/api/agent/upload-excel", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.msg || "Upload failed");
        return;
      }

      alert("Excel uploaded and saved to DB!");
      navigate("/agent/dashboard");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    }
  };

  return (
    <div className="import-excel-page container py-4">
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-arrow-left text-muted" role="button" onClick={() => navigate(-1)}></i>
          <div>
            <h3 className="fw-bold mb-0">Import Excel Data</h3>
            <p className="text-muted small mb-0">Upload your customer data in Excel format</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/agent/dashboard")}>
          Go to Dashboard
        </button>
      </div>

      <div className="upload-box p-4 mb-4 rounded bg-white shadow-sm w-100">
        <div className="text-center mb-3">
          <img src={excelIcon} alt="Excel Icon" className="upload-icon mb-2" />
          <h5 className="fw-bold">Upload Excel File</h5>
          <p className="text-muted mb-3">Select an Excel file (.xlsx) containing customer and insurance data</p>

          <div className="upload-area border-dashed rounded p-4 mb-4">
            <i className="bi bi-cloud-arrow-up fs-1 text-secondary"></i>
            <p className="text-muted mb-1">Click to upload Excel file</p>
            <small className="text-muted">Supports .xlsx files up to 10MB</small>
          </div>
        </div>

        <div className="d-flex justify-content-center">
          <label htmlFor="fileUpload" className="btn btn-manual px-4">
            Upload File
          </label>
          <input
            id="fileUpload"
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
      </div>

      <div className="bg-white rounded shadow-sm p-4">
        <h6 className="fw-bold mb-3">Excel File Format Requirements:</h6>
        <ul className="text-muted small ps-3">
          <li>Customer Name</li>
          <li>Phone</li>
          <li>Email</li>
          <li>Company Name</li>
          <li>Insurance Type</li>
          <li>Insurance Category</li>
          <li>Start Date (YYYY-MM-DD)</li>
          <li>Due Date (YYYY-MM-DD)</li>
          <li>Premium Amount</li>
          <li>Policy ID</li>
          <li>Sum Assured</li>
        </ul>
      </div>
    </div>
  );
};

export default ImportExcelPage;
