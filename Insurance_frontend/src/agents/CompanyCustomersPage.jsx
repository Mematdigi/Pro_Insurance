import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";

const CompanyCustomersPage = () => {
  const { companyName } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [policies, setPolicies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedCompany, setSelectedCompany] = useState("All");

  const insuranceOptions = {
    "Life Insurance": ["Term", "Whole Life", "Endowment", "Money-Back", "ULIP", "Child", "Pension"],
    "General Insurance": ["Health", "Motor", "Travel", "Home", "Fire", "Marine", "Personal Accident", "Commercial"],
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const agent = user || JSON.parse(localStorage.getItem("user"));
        const agentId = agent?.id || user?.id;
        if (!agentId || !companyName) return;

        const decodedCompany = decodeURIComponent(companyName).trim();
        const res = await fetch(
          `http://localhost:5000/api/policies?company=${encodeURIComponent(decodedCompany)}&agentId=${agentId}`
        );
        const data = await res.json();
        if (Array.isArray(data.policies)) {
          setPolicies(data.policies);
        }
      } catch (error) {
        console.error("Error fetching policies:", error);
      }
    };

    fetchPolicies();
  }, [companyName, user]);

  const getAgeFromDOB = (dob) => {
    if (!dob) return "--";
    try {
      const birth = new Date(dob);
      if (isNaN(birth.getTime())) return "--";
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      return age >= 0 && age <= 150 ? age : "--";
    } catch {
      return "--";
    }
  };

  const formatDate = (dateValue) => {
    try {
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split("T")[0];
      }
    } catch (e) {
      console.warn("Could not parse date:", dateValue);
    }
    return "--";
  };

  const filteredPolicies = policies.filter((p) => {
    const nameMatch = p.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const numberMatch = p.policyNumber?.toString().includes(searchTerm);
    const categoryMatch = selectedCategory === "All" || p.policyType === selectedCategory;
    const typeMatch = selectedType === "All" || p.policyDetails?.policySubType === selectedType;
    return (nameMatch || numberMatch) && categoryMatch && typeMatch;
  });

  return (
    <div className="dashboard-layout d-flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="main-content flex-grow-1">
        <div className="container py-4">
          <button className="btn btn-light border mb-3" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left me-2"></i> Back to Companies
          </button>

          <div className="d-flex justify-content-between align-items-start flex-wrap mb-4">
            <div>
              <h2 className="fw-bold">{decodeURIComponent(companyName)}</h2>
              <p className="text-muted">Manage all your customers and their insurance policies.</p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate("/agent/company-selection")}>+ Add Customer</button>
          </div>

          <div className="bg-white p-3 rounded shadow-sm mb-4">
            <div className="row g-3">
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="🔍 Search by Name / Number"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedType("All");
                  }}
                >
                  <option value="All">All Categories</option>
                  {Object.keys(insuranceOptions).map((cat, i) => (
                    <option key={i} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  disabled={selectedCategory === "All"}
                >
                  <option value="All">All Types</option>
                  {selectedCategory !== "All" && insuranceOptions[selectedCategory].map((type, i) => (
                    <option key={i} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCompany("All");
                    setSelectedCategory("All");
                    setSelectedType("All");
                  }}
                >
                  <i className="bi bi-x-circle me-1"></i> Clear
                </button>
              </div>
            </div>
          </div>

          {filteredPolicies.length === 0 ? (
            <div className="text-muted text-center py-5">No policies found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-striped align-middle">
                <thead className="table-header-custom">
                  <tr>
                    <th>S.N</th>
                    <th>CUSTOMER</th>
                    <th>CONTACT</th>
                    <th>POLICY NUMBER</th>
                    <th>COMPANY</th>
                    <th>INSURANCE</th>
                    <th>PREMIUM</th>
                    <th>NEXT DUE</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPolicies.map((p, idx) => {
                    const dob = p.dob || p.policyDetails?.dob || null;
                    return (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>
                          <strong>{p.customerName || "N/A"}</strong>
                          <div className="text-muted small">
                            Age: {getAgeFromDOB(dob)} <br />
                            DOB: {formatDate(dob)}
                          </div>
                        </td>
                        <td>
                          <div>{p.customerPhone || "N/A"}</div>
                          <div>{p.customerEmail || "N/A"}</div>
                        </td>
                        <td>{p.policyNumber || "N/A"}</td>
                        <td>{p.company || "N/A"}</td>
                        <td>{p.policyType || "N/A"}</td>
                        <td>₹{p.policyDetails?.premium || 0}</td>
                        <td>{formatDate(p.policyDetails?.endDate)}</td>
                        <td>{p.policyDetails?.status || "--"}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm text-primary"
                              onClick={() => navigate(`/agent/customer/${p._id || 0}`)}
                              title="View Customer"
                            >
                              <i className="bi bi-eye me-1"></i>
                            </button>
                            <button
                              className="btn btn-sm text-danger"
                              onClick={() => console.log("Delete customer logic")}
                              title="Delete Customer"
                            >
                              <i className="bi bi-trash me-1"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="d-flex justify-content-between mt-3 px-4">
            <div className="text-muted">Showing {filteredPolicies.length} of {filteredPolicies.length} customers</div>
            <nav>
              <ul className="pagination mb-0">
                <li className="page-item disabled"><button className="page-link">Previous</button></li>
                <li className="page-item active"><button className="page-link">1</button></li>
                <li className="page-item"><button className="page-link">Next</button></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCustomersPage;
