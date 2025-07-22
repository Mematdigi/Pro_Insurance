import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

const MedicalHistoryPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [search, setSearch] = useState({ name: "", policy: "" });
  const [result, setResult] = useState(null);

  const handleSearch = () => {
    setResult({
      customer: {
        name: "Rajesh Kumar",
        email: "rajesh.kumar@email.com",
        contact: "+91 98765 43210",
        policyNumber: "LIC12345678",
        company: "Life Insurance Corporation",
        category: "Term Life",
        type: "Individual",
        premium: "₹25,000.00",
        totalUsed: "₹50,000.00",
        remaining: "₹9,50,000.00",
        paymentMode: "Annual",
        branch: "Mumbai Central",
        medical: [
          {
            condition: "Diabetes Type 2",
            date: "15/01/2023",
            status: "Ongoing",
            doctor: "Dr. Sharma, City Hospital",
            meds: "Metformin 500mg twice daily",
            notes: "Monitoring required"
          }
        ]
      },
      family: [
        {
          name: "Anita Kumar",
          relation: "Spouse",
          policy: "LIC12345679",
          plan: "Health Plus",
          status: "Active",
          totalUsed: "₹15,000.00",
          remaining: "₹4,85,000.00",
          medical: [
            {
              condition: "Hypertension",
              date: "10/03/2018",
              status: "Controlled",
              doctor: "Dr. Verma, Max Hospital",
              meds: "Atenolol 50mg daily",
              notes: "Check BP monthly"
            }
          ]
        },
        {
          name: "Arjun Kumar",
          relation: "Son",
          plan: "Student Health",
          status: "Active",
          totalUsed: "₹0.00",
          remaining: "₹2,00,000.00",
          medical: [
            {
              condition: "Asthma",
              date: "05/02/2020",
              status: "Managed",
              doctor: "Dr. Patel, Children’s Hospital",
              meds: "Salbutamol inhaler as needed",
              notes: "Avoid allergens"
            }
          ]
        }
      ]
    });
  };

  return (
    <div className="dashboard-layout d-flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="main-content medical-history px-4 py-4">
        <h4 className="fw-bold">Medical History</h4>
        <p className="text-muted">View complete medical and policy history for customers and family members</p>

        {/* Search Section */}
        <div className="search-box shadow-sm bg-white p-4 rounded mb-4">
          <h6 className="text-primary fw-semibold mb-3"><i className="bi bi-search me-2" />Search Customer</h6>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Customer Name *</label>
              <input className="form-control" placeholder="e.g., Rajesh Kumar" value={search.name} onChange={(e) => setSearch({ ...search, name: e.target.value })} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Policy Number *</label>
              <input className="form-control" placeholder="e.g., LIC12345678" value={search.policy} onChange={(e) => setSearch({ ...search, policy: e.target.value })} />
            </div>
            <div className="col-12 text-end">
              <button className="btn btn-primary" onClick={handleSearch}><i className="bi bi-search me-1" />Search</button>
            </div>
          </div>
        </div>

        {/* Result Section */}
        {result && (
          <>
            {/* Customer Card */}
            <div className="bg-white border rounded shadow-sm p-4 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="text-primary fw-semibold"><i className="bi bi-person-vcard me-2" />Customer Policy & Medical History</h6>
                <button className="btn btn-outline-primary btn-sm"><i className="bi bi-download me-1" />Export Report</button>
              </div>
              <div className="row small mb-3">
                <div className="col-md-4">
                  <div><strong>Name:</strong> {result.customer.name}</div>
                  <div><strong>Email:</strong> {result.customer.email}</div>
                  <div><strong>Insurance Type:</strong> {result.customer.type}</div>
                  <div><strong>Branch:</strong> {result.customer.branch}</div>
                </div>
                <div className="col-md-4">
                  <div><strong>Policy No.:</strong> {result.customer.policyNumber}</div>
                  <div><strong>Company:</strong> {result.customer.company}</div>
                  <div><strong>Premium:</strong> {result.customer.premium}</div>
                  <div><strong>Used:</strong> {result.customer.totalUsed}</div>
                </div>
                <div className="col-md-4">
                  <div><strong>Contact:</strong> {result.customer.contact}</div>
                  <div><strong>Category:</strong> {result.customer.category}</div>
                  <div><strong>Payment Mode:</strong> {result.customer.paymentMode}</div>
                  <div><strong className="text-success">Remaining:</strong> {result.customer.remaining}</div>
                </div>
              </div>

              {/* Medical Table */}
              <div className="table-responsive">
                <table className="table table-bordered table-sm small">
                  <thead className="table-light text-uppercase">
                    <tr>
                      <th>Condition</th>
                      <th>Diagnosis Date</th>
                      <th>Status</th>
                      <th>Doctor/Hospital</th>
                      <th>Medications</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.customer.medical.map((m, i) => (
                      <tr key={i}>
                        <td>{m.condition}</td>
                        <td>{m.date}</td>
                        <td><span className="badge bg-warning text-dark">{m.status}</span></td>
                        <td>{m.doctor}</td>
                        <td>{m.meds}</td>
                        <td>{m.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Family Medical History */}
            <div className="family-history">
              <h6 className="fw-semibold text-secondary mb-3"><i className="bi bi-people me-2" />Family Members Policy & Medical History</h6>
              {result.family.map((member, i) => (
                <div className="bg-white border rounded shadow-sm p-4 mb-4" key={i}>
                  <div className="row small mb-2">
                    <div className="col-md-3"><strong>{member.name}</strong> — {member.relation}</div>
                    <div className="col-md-3"><strong>Policy:</strong> {member.policy}</div>
                    <div className="col-md-2"><strong>Plan:</strong> {member.plan}</div>
                    <div className="col-md-2"><strong>Status:</strong> <span className="text-success">{member.status}</span></div>
                    <div className="col-md-2 text-end">
                      <strong className="text-muted me-2">Used:</strong>{member.totalUsed}<br />
                      <strong className="text-success">Remaining:</strong> {member.remaining}
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered table-sm small mb-0">
                      <thead className="table-light text-uppercase">
                        <tr>
                          <th>Condition</th>
                          <th>Diagnosis Date</th>
                          <th>Status</th>
                          <th>Doctor/Hospital</th>
                          <th>Medications</th>
                          <th>Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {member.medical.map((m, j) => (
                          <tr key={j}>
                            <td>{m.condition}</td>
                            <td>{m.date}</td>
                            <td><span className="badge bg-success bg-opacity-25 text-success">{m.status}</span></td>
                            <td>{m.doctor}</td>
                            <td>{m.meds}</td>
                            <td>{m.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MedicalHistoryPage;
