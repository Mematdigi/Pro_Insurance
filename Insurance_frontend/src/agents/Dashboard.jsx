import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const AgentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [policies, setPolicies] = useState([]);
  useEffect(() => {
    const stored = localStorage.getItem("selectedInsuranceType");

    if (stored === "General Insurance" || stored === "Life Insurance") {
      setSelectedCategory(stored);
    } else {
      // Default to Life Insurance
      localStorage.setItem("selectedInsuranceType", "Life Insurance");
      setSelectedCategory("Life Insurance");
    }
  }, []);


  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSwitchCategory = (e) => {
    const newValue = e.target.value;
    setSelectedCategory(newValue);
    localStorage.setItem("selectedInsuranceType", newValue);
    window.location.reload();
  };

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const agent = user || JSON.parse(localStorage.getItem("user"));
        if (!agent?.id) {
          console.warn("❌ Agent ID not found.");
          return;
        }
        //const selectedLabel = localStorage.getItem("selectedInsuranceCategory")||"Life Insurance";
        const categoryParam = selectedCategory;

        console.log("📥 Fetching policies for agent ID:", agent.id, "with category:", categoryParam);
        // const res = await fetch(`http://localhost:5000/api/agent/${agent.id}?category=${categoryParam}`);
        //modify by suraj 
        // modify in categorySwitch        
        const res = await fetch(`http://localhost:5000/api/Insurance-by-Category?insuranceType=${categoryParam}&agentId=${agent.id}`);
        console.log(res);
        const data = await res.json();
        console.log("📊 Fetched data:", data);

        if (res.ok && Array.isArray(data)) {
          console.log("✅ Filtered Policies:", data);

          setPolicies(data);

        } else {
          console.warn("⚠️ Unexpected policy data structure:", data);
        }
      } catch (err) {
        console.error("🚫 Failed to fetch policies:", err);
      }
    };

    fetchPolicies();
  }, [user, selectedCategory]);

  const groupedCompanies = {};
  const uniqueCustomers = new Set();
  let totalEarnings = 0;

  policies.forEach((p, index) => {
    const company = p.company || "Unknown";
    const customerId = p.userId || p.policyNumber || `anonymous-${index}`;

    if (!groupedCompanies[company]) {
      groupedCompanies[company] = {
        name: company,
        status: "Active",
        customers: new Set(),
        policies: 0,
        earnings: 0,
      };
    }

    groupedCompanies[company].policies += 1;
    groupedCompanies[company].earnings += p.policyDetails?.premium || 0;
    groupedCompanies[company].customers.add(customerId);
    uniqueCustomers.add(customerId);
  });

  const totalCustomers = uniqueCustomers.size;
  const companies = Object.values(groupedCompanies).map((comp) => ({
    ...comp,
    customers: comp.customers.size,
  }));

  return (
    <div className="dashboard-layout d-flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      {sidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}

      <div className="main-content flex-grow-1">
        <div className="agent-dashboard-section">
          <div className="agent-dashboard container py-4">

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
              <div>
                <h2 className="fw-bold">Hello {user?.name || "Agent"},</h2>
                <p className="text-muted">Welcome to the Dashboard</p>
              </div>

              <div className="d-flex align-items-center gap-4">
                <div className="d-flex flex-column text-end">
                  <label htmlFor="categorySwitch" className="fw-semibold mb-1 text-muted small">
                    Insurance Category
                  </label>
                  
                  <select
                    id="categorySwitch"
                    value={selectedCategory}
                    onChange={handleSwitchCategory}
                    className="form-select form-select-sm fw-semibold"
                    style={{ minWidth: "200px" }}
                  >
                    <option value="Life Insurance">Life Insurance</option>
                    <option value="General Insurance">General Insurance</option>
                  </select>

                </div>

                <div className="d-flex align-items-center gap-2">
                  <img
                    src={user?.photo || "/public/testimonial/testimonial2.jpg"}
                    alt={user?.name}
                    className="rounded-circle"
                    style={{ width: "40px", height: "40px", objectFit: "cover" }}
                  />
                  <div className="d-flex flex-column">
                    <strong className="fw-semibold">{user?.name || "John Doe"}</strong>
                    <span className="text-muted small">Premium Customer</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="row g-3 mb-4">
              <div className="col-md-6 col-lg-3">
                <div className="p-4 bg-white shadow-sm rounded-3 h-100">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <p className="text-muted mb-1">Total Customers</p>
                    <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-3">
                      <i className="bi bi-people fs-5"></i>
                    </div>
                  </div>
                  <h4 className="fw-bold mb-1">{totalCustomers}</h4>
                  <div className="text-success small">+12.5% from last month</div>
                </div>
              </div>

              <div className="col-md-6 col-lg-3">
                <div className="p-4 bg-white shadow-sm rounded-3 h-100">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <p className="text-muted mb-1">Premium Collected</p>
                    <div className="bg-success bg-opacity-10 text-success p-2 rounded-3">
                      <i className="bi bi-credit-card-2-front fs-5"></i>
                    </div>
                  </div>
                  <h4 className="fw-bold mb-1">₹{totalEarnings.toLocaleString()}</h4>
                  <div className="text-success small">+8.2% from last month</div>
                </div>
              </div>

              <div className="col-md-6 col-lg-3">
                <div className="p-4 bg-white shadow-sm rounded-3 h-100">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <p className="text-muted mb-1">Premium Due</p>
                    <div className="bg-danger bg-opacity-10 text-danger p-2 rounded-3">
                      <i className="bi bi-exclamation-circle fs-5"></i>
                    </div>
                  </div>
                  <h4 className="fw-bold mb-1">₹{(totalEarnings * 0.22).toLocaleString()}</h4>
                  <div className="text-danger small">-3.1% from last month</div>
                </div>
              </div>

              <div className="col-md-6 col-lg-3">
                <div className="p-4 bg-white shadow-sm rounded-3 h-100">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <p className="text-muted mb-1">Due Rate</p>
                    <div className="bg-warning bg-opacity-10 text-warning p-2 rounded-3">
                      <i className="bi bi-percent fs-5"></i>
                    </div>
                  </div>
                  <h4 className="fw-bold mb-1">21.6%</h4>
                  <div className="text-success small">-1.2% from last month</div>
                </div>
              </div>
            </div>

            {/* Action Cards */}
            <div className="row g-4 mb-5">
              <div className="col-md-6">
                <div className="p-4 Manual_Box rounded-4 shadow-sm bg-white h-100 d-flex flex-column justify-content-between">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="icon-circle bg-opacity-10 rounded-4 p-3">
                      <i className="bi bi-person-plus fs-3"></i>
                    </div>
                    <h5 className="fw-bold mb-0">Add Customer Manually</h5>
                  </div>
                  <p className="text-muted mb-3">
                    Create a new customer profile with detailed information and contact details.
                  </p>
                  <div>
                    <button
                      className="btn btn-link text-primary p-0 fw-semibold"
                      onClick={() => navigate("/agent/add-manual")}
                    >
                      Get Started <i className="bi bi-arrow-right-short fs-5"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="p-4 import__Box rounded-4 shadow-sm bg-white h-100 d-flex flex-column justify-content-between">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="icon-circle bg-opacity-10 rounded-4 p-3">
                      <i className="bi bi-file-earmark-spreadsheet fs-3"></i>
                    </div>
                    <h5 className="fw-bold mb-0">Import via Excel</h5>
                  </div>
                  <p className="text-muted mb-3">
                    Upload and import multiple customer records from Excel spreadsheets in bulk.
                  </p>
                  <div>
                    <button
                      className="btn btn-link text-success p-0 fw-semibold"
                      onClick={() => navigate("/agent/import-excel")}
                    >
                      Upload File <i className="bi bi-arrow-right-short fs-5"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
