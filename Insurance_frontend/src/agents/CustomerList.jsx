import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const CustomerList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [customers, setCustomers] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");

  const insuranceOptions = {
    "Life Insurance": ["Term", "Whole Life", "Endowment", "Money-Back", "ULIP", "Child", "Pension"],
    "General Insurance": ["Health", "Motor", "Travel", "Home", "Fire", "Marine", "Personal Accident", "Commercial", "Liability", "Cyber"],
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const agent = user || JSON.parse(localStorage.getItem("user"));
        if (!agent?.id) {
          console.warn("❌ Agent ID not found.");
          return;
        }

        const res = await fetch(`http://localhost:5000/api/agent/${agent.id}`);
        const data = await res.json();

        console.log("📥 API Raw Response:", data);

        // ✅ data is an array of policy objects
        const policies = Array.isArray(data) ? data : [];

        const formatted = policies.map((p, index) => ({
          id: p._id || index,
          name: p.customerName || "Unknown",
          phone: p.customerPhone, 
          email: p.customerEmail,
          company: p.company || "Unknown",
          category: p.insuranceType ||  "Unknown",
            
          type: p.policyType || "Unknown",
          premium: Number(p.policyDetails?.premium || 0),
          dueDate: p.policyDetails?.endDate || "",
          policyId: p.policyNumber|| "",
          sumAssured: p.policyDetails?.sumInsured || "",
        }));

        console.log("✅ Parsed customers:", formatted);
        setCustomers(formatted);
      } catch (err) {
        console.error("❌ Error fetching customers:", err);
      }
    };

    fetchCustomers();
  }, []);

  const companyOptions = ["All", ...new Set(customers.map((c) => c.company).filter(Boolean))];

  const filtered = customers.filter((c) => {
    const nameMatch =
      (c.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (c.phone || "").includes(searchTerm);

    const companyMatch = selectedCompany === "All" || c.company === selectedCompany;
    const categoryMatch = selectedCategory === "All" || c.category === selectedCategory;
    const typeMatch = selectedType === "All" || c.type === selectedType;

    const dueMonth = c.dueDate?.slice(5, 7);
    const dueYear = c.dueDate?.slice(0, 4);

    const monthMatch = selectedMonth === "All" || dueMonth === selectedMonth;
    const yearMatch = selectedYear === "All" || dueYear === selectedYear;

    return nameMatch && companyMatch && categoryMatch && typeMatch && monthMatch && yearMatch;
  });

  const handleExport = () => {
    const csv = [
      ["Customer", "Phone", "Email", "Company", "Category", "Insurance Type", "Policy ID", "Sum Assured", "Premium", "Due Date"],
      ...filtered.map((c) => [
        c.name, c.phone, c.email, c.company, c.category, c.type,
        c.policyId, c.sumAssured, c.premium, c.dueDate
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "customer_data.csv";
    link.click();
  };

  return (
    <div className="dashboard-layout d-flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="main-content flex-grow-1">
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <div>
              <h2 className="fw-bold">Customers</h2>
              <p className="text-muted">Manage all your customers and their insurance policies.</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded shadow-sm mb-4">
            <div className="row g-3 mb-2">
              <div className="col-md-3 position-relative">
                <input
                  type="text"
                  className="form-control ps-5"
                  placeholder="Search by Customer Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i
                  className="bi bi-search position-absolute text-muted"
                  style={{ top: "50%", left: "15px", transform: "translateY(-50%)" }}
                ></i>
              </div>

              <div className="col-md-3">
                <select className="form-select" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                  <option value="All">All Months</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={String(i + 1).padStart(2, "0")}>
                      {new Date(0, i).toLocaleString("default", { month: "long" })}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <select className="form-select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                  <option value="All">All Years</option>
                  {Array.from(new Set(customers.map((c) => c.dueDate?.slice(0, 4)))).map(
                    (year, i) => year && <option key={i} value={year}>{year}</option>
                  )}
                </select>
              </div>

              <button className="btn btn-primary col-md-3" onClick={handleExport}>
                <i className="bi bi-download me-2"></i>Export Data
              </button>
            </div>

            <div className="row g-3 align-items-center">
              <div className="col-md-3">
                <select className="form-select" value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
                  <option value="All">All Companies</option>
                  {companyOptions.map((comp, i) => (
                    <option key={i} value={comp}>{comp}</option>
                  ))}
                </select>
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
                  {selectedCategory !== "All" &&
                    insuranceOptions[selectedCategory].map((type, i) => (
                      <option key={i} value={type}>{type}</option>
                    ))}
                </select>
              </div>

              <div className="col-md-3 text-end">
                <button
                  className="btn btn-outline-secondary px-4"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCompany("All");
                    setSelectedCategory("All");
                    setSelectedType("All");
                    setSelectedMonth("All");
                    setSelectedYear("All");
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-primary">
                <tr>
                  <th>S.N</th>
                  <th>Policy ID</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Company</th>
                  <th>Category</th>
                  <th>Insurance Type</th>
                  <th>Premium</th>
                  <th>Due</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4 text-muted">
                      No matching data found.
                    </td>
                  </tr>
                ) : (
                  
                  filtered.map((row, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{row.policyId}</td>
                      <td>{row.name}</td>
                      <td>{row.phone}</td>
                      <td>{row.company}</td>
                      <td>{row.category}</td>
                      <td>{row.type}</td>
                      <td>₹{row.premium.toLocaleString()}</td>
                      <td>{row.dueDate}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
  onClick={() => navigate(`/agent/customer/${row.id.split("-")[0]}`)} // ✅ FIXED
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger">
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
