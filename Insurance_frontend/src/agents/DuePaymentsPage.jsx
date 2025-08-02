import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const DuePaymentsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [allCustomers, setAllCustomers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    dueDate: "",
    company: "",
    type: "",
  });
  const [modalData, setModalData] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDuePayments = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/due-next-month/${user.id}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        console.log("Due payments data:", data);
        if (res.ok) {
          const formattedData = data.map((p) => ({
            name: p.customerName || "Unknown",
            company: p.company || "Unknown",
            insuranceType: p.policyType || "N/A",
            premium: p.policyDetails.premium,
            dueDate: new Date(p.policyDetails?.endDate).toISOString().split("T")[0] || "N/A",
            status: "Due",
          }));
          setAllCustomers(formattedData);
          setFiltered(formattedData);
        } else {
          console.error("Failed to fetch due payments:", data);
        } 
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    if (user?.id) fetchDuePayments();
  }, [user]);

  function handleFilterChange(e) {
  const { name, value } = e.target;
  const newFilters = { ...filters, [name]: value };
  setFilters(newFilters);
  applyFilters(newFilters);
}

  const applyFilters = (filters) => {
    const f = allCustomers.filter((item) => {
      return (
        (!filters.dueDate || item.dueDate === filters.dueDate) &&
        (!filters.company || item.company === filters.company) &&
        (!filters.type || item.type === filters.type)
      );
    });
    setFiltered(f);
  };

  const clearAll = () => {
    setFilters({ dueDate: "", company: "", type: "" });
    setFiltered(allCustomers);
  };

  const generateMessage = (cust) => {
    return `Hi ${cust.name}! 👋\n\nYour ${cust.type} Insurance premium of ₹${parseFloat(cust.premium).toLocaleString()} is due on ${cust.dueDate}.\n\nPlease make the payment at your earliest convenience to avoid any service interruption.\n\nThank you! 🙏`;
  };

  return (
    <div className="dashboard-layout d-flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className=" main-content flex-grow-1">
        <div className="due-page-container p-3">
          <h2 className="title">Due Payments</h2>
          <p className="subtitle">Manage customer due payments and track import data efficiently</p>

          <div className="payment-section">
            <div className="payment-filters">
              <h5 className="filter-title">🔍 Payment Filters</h5>
              <div className="filters-grid">
                <div>
                  <label>Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={filters.dueDate}
                    onChange={handleFilterChange}
                  />
                </div>
                <div>
                  <label>Insurance Company</label>
                  <select name="company" value={filters.company} onChange={handleFilterChange}>
                    <option value="">Select company</option>
                    <option value="LIC">LIC</option>
                    <option value="HDFC">HDFC</option>
                    <option value="SBI">SBI</option>
                  </select>
                </div>
                <div>
                  <label>Insurance Type</label>
                  <select name="type" value={filters.type} onChange={handleFilterChange}>
                    <option value="">Select type</option>
                    <option value="Health">Health</option>
                    <option value="Life">Life</option>
                    <option value="Term">Term</option>
                  </select>
                </div>
                <div className="align-bottom">
                  <button className="clear-btn" onClick={clearAll}>❌ Clear All</button>
                </div>
              </div>
            </div>

            <div className="table-section mt-5">
              <div className="table-header d-flex justify-content-between align-items-center flex-wrap mb-3">
                <h5 className="fw-bold text-dark mb-2"> Due Payments Overview</h5>
                <button className="btn btn-primary">
                  <i className="bi bi-download"></i> Download Report
                </button>
              </div>
              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">Customer Name</th>
                      <th scope="col">Insurance Type</th>
                      <th scope="col">Company</th>
                      <th scope="col">Premium Amount</th>
                      <th scope="col">Due Date</th>
                      <th scope="col">Status</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((cust, i) => {
                      const today = new Date().toISOString().split("T")[0];
                      const status = cust.dueDate < today ? "Overdue" : "Due";
                      return (
                        <tr key={i}>
                          <td>{cust.name}</td>
                          <td>{cust.insuranceType} </td>
                          <td>{cust.company}</td>
                          <td className="text-primary fw-semibold">₹{parseFloat(cust.premium).toLocaleString()}</td>
                          <td>{cust.dueDate}</td>
                          <td>
                            <span className={`badge rounded-pill bg-${status === "Overdue" ? "danger" : "warning"} text-light`}>
                              {status}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex flex-wrap gap-2">
                              <button className="btn btn-outline-primary btn-sm">
                                <i className="bi bi-bell"></i> Remind
                              </button>
                              <button
                                className="btn btn-outline-success btn-sm"
                                onClick={() => setModalData({ ...cust, status })}
                              >
                                <i className="bi bi-chat-dots"></i> Message
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {modalData && (
            <div className="reminder-modal">
              <div className="modal-content">
                <div className="modal-header">
                  <h5>📨 Send Payment Reminder</h5>
                  <button onClick={() => setModalData(null)}>✖</button>
                </div>
                <div className="modal-summary">
                  <div>
                    <strong>{modalData.name}</strong>
                    <div>{modalData.type} Insurance - {modalData.company}</div>
                    <small>Due: {modalData.dueDate}</small>
                  </div>
                  <div>
                    <h5 className="text-blue">₹{parseFloat(modalData.premium).toLocaleString()}</h5>
                    <span className={`status ${modalData.status.toLowerCase()}`}>{modalData.status}</span>
                  </div>
                </div>
                <div className="modal-body">
                  <label>Reminder Method</label>
                  <select disabled>
                    <option>WhatsApp</option>
                  </select>
                  <label>Message Preview</label>
                  <textarea readOnly rows={6}>{generateMessage(modalData)}</textarea>
                  <div className="modal-actions">
                    <button onClick={() => setModalData(null)} className="cancel">Cancel</button>
                    <button className="send"> Send WhatsApp Reminder</button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default DuePaymentsPage;
