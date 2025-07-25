import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

const FamilyHistory = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState("Rajesh Kumar");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const familyMembers = [];
    
  const selected = familyMembers.find(m => m.name === selectedMember);

  return (
    <div className="dashboard-layout d-flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="main-content p-4">
        <h2 className="fw-bold">Family History</h2>
        <p className="text-muted">Manage and track family member insurance policies</p>

        {/* Search Section */}
        <div className="bg-white shadow-sm p-4 rounded-4 mt-4 mb-3">
          <h6 className="fw-semibold"><i className="bi bi-search me-2"></i>Search Family Members</h6>
          <div className="row mt-3">
            <div className="col-md-5 mb-2">
              <input type="text" className="form-control" placeholder="Enter policy number" />
            </div>
            <div className="col-md-5 mb-2">
              <input type="text" className="form-control" placeholder="Enter family member name" />
            </div>
            <div className="col-md-2">
              <button className="btn btn-primary w-100"><i className="bi bi-search me-1"></i>Search</button>
            </div>
          </div>
        </div>

        {/* Family Members Table */}
        <div className="bg-white shadow-sm p-4 rounded-4 mb-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-semibold"><i className="bi bi-person-lines-fill me-2"></i>Family Members ({familyMembers.length})</h6>
            <button className="btn btn-outline-primary btn-sm"><i className="bi bi-download me-1"></i>Export</button>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Family Member Name</th>
                  <th>Relation</th>
                  <th>Insurance Plan</th>
                  <th>Policy Status</th>
                  <th>Due Amount (₹)</th>
                  <th>Maturity Amount (₹)</th>
                  <th>Loan Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {familyMembers.map((member, idx) => (
                  <tr key={idx}>
                    <td>{member.name}</td>
                    <td>{member.relation}</td>
                    <td>{member.plan}</td>
                    <td><span className="badge bg-success-subtle text-success">Active</span></td>
                    <td>{member.due}</td>
                    <td>{member.maturity}</td>
                    <td>{member.loan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Premium Due Section */}
        <div className="bg-white shadow-sm p-4 rounded-4">
          <h6 className="fw-semibold"><i className="bi bi-calendar2-event me-2"></i>Premium Due This Month</h6>
          <div className="d-flex gap-3 mt-3 flex-wrap">
            {familyMembers.map((member) => (
              <button
                key={member.name}
                className={`btn ${selectedMember === member.name ? 'btn-primary' : 'btn-light'}`}
                onClick={() => setSelectedMember(member.name)}
              >
                {member.name}
              </button>
            ))}
          </div>

          {selected.premiumSchedule.length > 0 && (
            <div className="mt-4">
              <h6>{selected.name} - Premium Schedule</h6>
              <table className="table table-bordered mt-2">
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Policy No.</th>
                    <th>Due Amount (₹)</th>
                    <th>Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.premiumSchedule.map((entry, idx) => (
                    <tr key={idx}>
                      <td>{entry.date}</td>
                      <td>{entry.policyNo}</td>
                      <td>{entry.amount}</td>
                      <td><span className="badge bg-warning-subtle text-warning">{entry.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FamilyHistory;
