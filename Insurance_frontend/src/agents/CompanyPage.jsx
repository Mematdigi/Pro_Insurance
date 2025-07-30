import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useCategory } from "../context/CategoryContext";

const CompanyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [policies, setPolicies] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  //const [selectedCategory, setSelectedCategory] = useState("all"); //change d
  const {selectedCategory} = useCategory();


  //changed
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // changed
  

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const agent = user || JSON.parse(localStorage.getItem("user"));
        if (!agent?.id) {
          
          console.warn("❌ Agent ID not found.");
          return;
        }

        const res = await fetch(`http://localhost:5000/api/Insurance-by-Category?insuranceType=${selectedCategory}&agentId=${agent.id}`); //changed
        const data = await res.json();
        console.log("📊 Fetched data:", data);

        if (Array.isArray(data)) {
          setPolicies(data);
        } else if (Array.isArray(data.policies)) {
          setPolicies(data.policies);
        } else {
          console.warn("❌ Invalid data format received from server.");
        }
      } catch (err) {
        console.error("🚫 Failed to fetch policies:", err);
      }
    };

    fetchCompanies();
  }, [user, selectedCategory]);

  // Group by company name
  const groupedCompanies = {};
  policies.forEach((policy) => {
    const company = policy.company || "Unknown";

    if (!groupedCompanies[company]) {
      groupedCompanies[company] = {
        company,
        totalPolicies: 0,
        totalEarnings: 0,
        customers: new Set(),
      };
    }

    groupedCompanies[company].totalPolicies += 1;
    groupedCompanies[company].totalEarnings += policy.policyDetails?.premium || 0;
    groupedCompanies[company].customers.add(policy.userId);
  });

  const companyStats = Object.values(groupedCompanies).map((comp) => ({
    ...comp,
    id: comp.company.trim().toLowerCase().replace(/\s+/g, "-"),
    customers: comp.customers.size,
  }));

  const filteredStats = companyStats.filter((c) =>
    c.company.toLowerCase().includes(search.toLowerCase())
  );

  // Checkbox handlers
  const handleCheckboxChange = (id) => {
    if (selected.includes(id)) {
      setSelected((prev) => prev.filter((s) => s !== id));
    } else {
      setSelected((prev) => [...prev, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
    } else {
      const allIds = filteredStats.map((comp) => comp.id);
      setSelected(allIds);
    }
    setSelectAll(!selectAll);
  };

  const handleDeleteSelected = () => {
    if (selected.length === 0) return alert("No companies selected.");
    const confirmed = window.confirm("Delete selected companies?");
    if (!confirmed) return;

    const updatedPolicies = policies.filter(
      (p) => !selected.includes((p.company || "unknown").trim().toLowerCase().replace(/\s+/g, "-"))
    );
    setPolicies(updatedPolicies);
    setSelected([]);
    setSelectAll(false);
  };

  return (
    <div className="dashboard-layout d-flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="main-content flex-grow-1">
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <h2 className="fw-bold">Companies</h2>
            <button className="btn btn-primary" onClick={() => navigate("/agent/company-selection")}>
              + Add Company
            </button>
          </div>

          {/* Stats */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="p-3 bg-white shadow-sm rounded">
                <p className="mb-1 text-muted">New Customers</p>
                <h4>{companyStats.reduce((a, b) => a + b.customers, 0)}</h4>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3 bg-white shadow-sm rounded">
                <p className="mb-1 text-muted">Premium Due</p>
                <h4>₹{companyStats.reduce((a, b) => a + b.totalEarnings, 0).toLocaleString()}</h4>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3 bg-white shadow-sm rounded">
                <p className="mb-1 text-muted">Premium Collected</p>
                <h4 className="text-primary">₹{companyStats.reduce((a, b) => a + b.totalEarnings, 0).toLocaleString()}</h4>
              </div>
            </div>
            
          </div>

          {/* Filter + Delete UI */}
          {/* Filter + Delete UI */}
<div className="row align-items-end gy-3 gx-4 mb-4">
  <div className="col-md-6 d-flex align-items-end gap-3">
    <div className="d-flex flex-column">
      <label className="mb-1 fw-semibold">Filter by Company</label>
      <select
        className="form-select"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "220px" }} // ✅ Fixed width
      >
        <option value="">-- All Companies --</option>
        {companyStats.map((comp, i) => (
          <option key={i} value={comp.company}>
            {comp.company}
          </option>
        ))}
      </select>
    </div>

    <button className="btn btn-outline-secondary h-50 align-self-end" onClick={() => setSearch("")}>
      <i className="bi bi-x-circle me-1"></i> Reset
    </button>
  </div>

  <div className="col-md-6 d-flex justify-content-md-end align-items-center gap-3">
    <div className="form-check mb-0">
      <input
        type="checkbox"
        className="form-check-input"
        id="selectAll"
        checked={selectAll}
        onChange={handleSelectAll}
      />
      <label className="form-check-label" htmlFor="selectAll">Select All</label>
    </div>
    <button className="btn btn-outline-danger" onClick={handleDeleteSelected}>
      <i className="bi bi-trash me-1"></i> Delete Selected
    </button>
  </div>
</div>


          {/* Cards */}
          <div className="row g-4">
            {filteredStats.map((company, idx) => (
              <div className="col-md-4" key={idx}>
                <div className="bg-white p-4 shadow-sm rounded h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                          {company.company[0]}
                        </div>
                        <div>
                          <h5 className="mb-0 fw-semibold">{company.company}</h5>
                          <small className="text-muted">Insurance Partner</small>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selected.includes(company.id)}
                        onChange={() => handleCheckboxChange(company.id)}
                      />
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                      <small>Total Customers</small>
                      <strong>{company.customers}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <small>Active Policies</small>
                      <strong className="text-success">{company.totalPolicies}</strong>
                    </div>
                    <div className="d-flex justify-content-between mt-2">
                      <small>Monthly Premium</small>
                      <strong>₹{company.totalEarnings.toLocaleString()}</strong>
                    </div>
                  </div>
                  <div className="d-flex gap-2 mt-3">
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => navigate(`/agent/company/${encodeURIComponent(company.company)}`)}
                    >
                      <i className="bi bi-eye me-1"></i> View
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      title="Delete Company"
                      onClick={() => alert("Single delete not implemented")}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredStats.length === 0 && (
            <div className="text-center text-muted mt-4">No companies found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
