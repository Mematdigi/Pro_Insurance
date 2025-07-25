// src/agents/CompanySelection.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import excelIcon from "/public/icons/excel-icon.png"; // replace with actual paths
import manualIcon from "/public/icons/manual-icon.png"; // replace with actual paths

const CompanySelection = () => {
  const [company, setCompany] = useState("");
  const [agentId, setAgentId] = useState("");
  const navigate = useNavigate();

  const handleImportClick = () => {
    navigate("/agent/import-excel");
  };

  const handleManualClick = () => {
    navigate("/agent/add-manual");
  };

  return (
    <div className="company-selection-page">
      <div className="text-center mb-4">
        <h1 className="title">Welcome to Insurance CRM</h1>
        <p className="subtitle">
          Choose how you'd like to add insurance data
        </p>
      </div>

      <div className="selection-grid">
        {/* Excel Import Card */}
        <div className="option-card">
          <img src={excelIcon} alt="Excel" className="option-icon" />
          <h3>Import Excel Data</h3>
          <p>
            Upload an Excel file (<code>.xlsx</code>) to import multiple
            customer records at once. Fast and efficient for bulk data entry.
          </p>
          <button className="btn btn-excel" onClick={handleImportClick}>
            Choose Excel Import
          </button>
        </div>

        {/* Manual Entry Card */}
        <div className="option-card">
          <img src={manualIcon} alt="Manual" className="option-icon" />
          <h3>Add Manually</h3>
          <p>
            Fill out a detailed form to add customer information one by one.
            Perfect for complete control over data entry.
          </p>
          <button className="btn btn-manual" onClick={handleManualClick}>
            Start Manual Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanySelection;
