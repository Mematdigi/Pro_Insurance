import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

const PolicyAlterations = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchData, setSearchData] = useState({ customerName: "", policyNumber: "" });
  const [policyData, setPolicyData] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSearch = () => {
    setPolicyData({
      customerName: "Rajesh Kumar",
      policyNumber: "LIC12345678",
      contact: "+91 9876543210",
      email: "rajesh@example.com",
      company: "LIC India",
      category: "Life Insurance",
      type: "Term",
      branch: "Patna Main",
      premium: "15000",
      paymentMode: "Quarterly",
      startDate: "2023-04-01",
      maturityDate: "2043-04-01",
      nomineeName: "Anita Kumari",
      nomineeRelation: "Wife",
    });
    setShowInstructions(false);
  };

  const handleChange = (e) => {
    setPolicyData({ ...policyData, [e.target.name]: e.target.value });
  };

  return (
    <div className="dashboard-layout d-flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="main-content policy-alterations p-4">
        <h3 className="fw-bold text-center">Policy Alterations</h3>
        <p className="text-center text-muted">Search and modify policy details</p>

        {/* Search Box Styled */}
        <div className="search-box shadow-sm rounded mb-3">
          <h5 className="mb-3 d-flex align-items-center text-primary">
            <i className="bi bi-search me-2"></i> Search Policy
          </h5>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Customer Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter customer name"
                value={searchData.customerName}
                onChange={(e) => setSearchData({ ...searchData, customerName: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Policy Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter policy number"
                value={searchData.policyNumber}
                onChange={(e) => setSearchData({ ...searchData, policyNumber: e.target.value })}
              />
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button className="btn btn-primary w-100" onClick={handleSearch}>
                <i className="bi bi-search me-2"></i>Search
              </button>
            </div>
          </div>
        </div>

        {/* Instructions Box */}
        {showInstructions && (
          <div className="bg-light-primary border-0 rounded p-4 mb-4 shadow-sm d-flex align-items-start">
            <div className="me-3">
              <div className="bg-primary text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                <i className="bi bi-info-lg"></i>
              </div>
            </div>
            <div>
              <h6 className="fw-semibold text-primary mb-1">Instructions</h6>
              <p className="mb-0 text-primary">
                Search for a policy using customer name and policy number. Once found, the policy details will be displayed and you can enter the Policy Alterations info in the form below.
              </p>
            </div>
          </div>
        )}

        {/* Policy Form Section */}
        {policyData && (
          <div className="policy-details">
            <h6><i className="bi bi-file-earmark-text me-2"></i>Policy Details</h6>
            <div className="row g-4">

              {/* Customer Info */}
              <div className="col-md-6">
                <h6 className="section-heading"><i className="bi bi-person-lines-fill me-2"></i>Customer Information</h6>
                <label className="form-label">Customer Name</label>
                <input className="form-control" value={policyData.customerName} name="customerName" onChange={handleChange} />

                <label className="form-label mt-2">Policy Number</label>
                <input className="form-control" value={policyData.policyNumber} name="policyNumber" onChange={handleChange} />

                <label className="form-label mt-2">Contact Number</label>
                <input className="form-control" value={policyData.contact} name="contact" onChange={handleChange} />

                <label className="form-label mt-2">Email</label>
                <input className="form-control" value={policyData.email} name="email" onChange={handleChange} />
              </div>

              {/* Policy Info */}
              <div className="col-md-6">
                <h6 className="section-heading"><i className="bi bi-shield-check me-2"></i>Policy Information</h6>
                <label className="form-label mt-2">Insurance Company</label>
                <input className="form-control" value={policyData.company} name="company" onChange={handleChange} />

                <label className="form-label mt-2">Insurance Category</label>
                <select className="form-select" name="category" value={policyData.category} onChange={handleChange}>
                  <option>Life Insurance</option>
                  <option>General Insurance</option>
                </select>

                <label className="form-label mt-2">Insurance Type</label>
                <select className="form-select" name="type" value={policyData.type} onChange={handleChange}>
                  <option>Term</option>
                  <option>ULIP</option>
                  <option>Money Back</option>
                </select>

                <label className="form-label mt-2">Branch Name</label>
                <input className="form-control" value={policyData.branch} name="branch" onChange={handleChange} />
              </div>

              {/* Premium Info */}
              <div className="col-md-6">
                <h6 className="section-heading"><i className="bi bi-cash-coin me-2"></i>Premium Information</h6>
                <label className="form-label mt-2">Premium Amount (₹)</label>
                <input className="form-control" value={policyData.premium} name="premium" onChange={handleChange} />

                <label className="form-label mt-2">Payment Mode</label>
                <select className="form-select" name="paymentMode" value={policyData.paymentMode} onChange={handleChange}>
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Yearly</option>
                </select>

                <label className="form-label mt-2">Premium Start Date</label>
                <input className="form-control" type="date" name="startDate" value={policyData.startDate} onChange={handleChange} />

                <label className="form-label mt-2">Maturity Date</label>
                <input className="form-control" type="date" name="maturityDate" value={policyData.maturityDate} onChange={handleChange} />
              </div>

              {/* Nominee Info */}
              <div className="col-md-6">
                <h6 className="section-heading"><i className="bi bi-person-badge me-2"></i>Nominee Information</h6>
                <label className="form-label mt-2">Nominee Name</label>
                <input className="form-control" value={policyData.nomineeName} name="nomineeName" onChange={handleChange} />

                <label className="form-label mt-2">Nominee Relation</label>
                <select className="form-select" name="nomineeRelation" value={policyData.nomineeRelation} onChange={handleChange}>
                  <option>Wife</option>
                  <option>Son</option>
                  <option>Daughter</option>
                </select>
              </div>
            </div>

            <div className="submit-btn">
              <button className="btn">
                <i className="bi bi-floppy me-2"></i>Submit Alterations
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyAlterations;
