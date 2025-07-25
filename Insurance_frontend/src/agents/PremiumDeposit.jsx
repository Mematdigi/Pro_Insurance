import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const PremiumDeposit = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [form, setForm] = useState({
    policyNumber: "",
    customerName: "",
    premiumAmount: "",
    paymentDate: "",
    paymentMode: "",
    transactionId: "",
    receiptNumber: "",
    agentCode: "Cash",
    lateFee: "",
    totalAmount: "",
    nextDueDate: "2025-01-15",
    remarks: "Premium paid on time",
  });

  const recentDeposits = [
    {
      customer: "Rajesh Kumar",
      policy: "LIC12345678",
      amount: 12500,
      date: "2024-01-15",
      mode: "Cash",
      status: "Confirmed",
    },
    {
      customer: "Suresh Sharma",
      policy: "LIC87654321",
      amount: 8750,
      date: "2024-01-14",
      mode: "Cheque",
      status: "Pending",
    },
    {
      customer: "Amit Gupta",
      policy: "LIC11223344",
      amount: 15000,
      date: "2024-01-13",
      mode: "Online",
      status: "Confirmed",
    },
    {
      customer: "Priya Singh",
      policy: "LIC55667788",
      amount: 6250,
      date: "2024-01-12",
      mode: "UPI",
      status: "Confirmed",
    },
    {
      customer: "Deepak Verma",
      policy: "LIC99887766",
      amount: 10000,
      date: "2024-01-11",
      mode: "NEFT",
      status: "Processing",
    },
  ];

  return (
    <div className="dashboard-layout d-flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="main-content flex-grow-1 px-4 py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4 className="fw-bold">Premium Deposit Entry</h4>
            <p className="text-muted mb-0">
              Record premium payments and manage deposit entries
            </p>
          </div>
          <button className="btn btn-outline-primary" onClick={() => navigate("/agent/dashboard")}>
            <i className="bi bi-speedometer2 me-1"></i> Go to Dashboard
          </button>
        </div>

        <div className="row g-4">
          {/* Form */}
          <div className="col-lg-6">
  <div className="bg-white rounded shadow-sm p-4">
    <h6 className="fw-semibold mb-3 text-success">
      <i className="bi bi-currency-dollar me-2"></i>Record Premium Payment
    </h6>
    <form>
      <div className="row g-3">
        {[
          { label: "Policy Number", key: "policyNumber" },
          { label: "Customer Name", key: "customerName" },
          { label: "Premium Amount (₹)", key: "premiumAmount" },
          { label: "Payment Date", key: "paymentDate", type: "date" },
          { label: "Transaction ID", key: "transactionId" },
          { label: "Receipt Number", key: "receiptNumber" },
          { label: "Agent Code", key: "agentCode" },
          { label: "Late Fee (₹)", key: "lateFee" },
          { label: "Total Amount (₹)", key: "totalAmount" },
          { label: "Next Due Date", key: "nextDueDate", type: "date" },
        ].map((field, i) => (
          <div className="col-md-6" key={i}>
            <label className="form-label">{field.label}</label>
            <input
              type={field.type || "text"}
              className="form-control"
              value={form[field.key]}
              name={field.key}
              onChange={(e) =>
                setForm({ ...form, [field.key]: e.target.value })
              }
            />
          </div>
        ))}

        <div className="col-md-6">
          <label className="form-label">Payment Mode *</label>
          <select
            className="form-select"
            value={form.paymentMode}
            name="paymentMode"
            onChange={(e) => setForm({ ...form, paymentMode: e.target.value })}
          >
            {["Cash", "Cheque", "Online", "UPI", "NEFT"].map((m, i) => (
              <option key={i}>{m}</option>
            ))}
          </select>
        </div>

        <div className="col-12">
          <label className="form-label">Remarks</label>
          <textarea
            className="form-control"
            rows={3}
            name="remarks"
            value={form.remarks}
            onChange={(e) => setForm({ ...form, remarks: e.target.value })}
          />
        </div>
      </div>

      <div className="d-flex gap-3 mt-4">
        <button type="submit" className="btn btn-success">
          <i className="bi bi-check-circle me-1"></i> Record Payment
        </button>
        <button type="button" className="btn btn-outline-dark">
          <i className="bi bi-printer me-1"></i> Print Receipt
        </button>
      </div>
    </form>
  </div>
</div>

          {/* Table */}
          <div className="col-lg-6">
            <div className="bg-white rounded shadow-sm p-4 h-100">
              <h6 className="fw-semibold mb-3">Recent Premium Deposits</h6>
              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                  <thead className="table-light small text-uppercase">
                    <tr>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Mode</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentDeposits.map((d, idx) => (
                      <tr key={idx}>
                        <td>
                          <strong>{d.customer}</strong>
                          <div className="text-muted small">{d.policy}</div>
                        </td>
                        <td>₹{d.amount.toLocaleString()}</td>
                        <td>{d.date}</td>
                        <td>
                          <span className="badge bg-light border text-dark">{d.mode}</span>
                        </td>
                        <td>
                          <span
                            className={`badge rounded-pill ${
                              d.status === "Confirmed"
                                ? "bg-success-subtle text-success"
                                : d.status === "Pending"
                                ? "bg-warning-subtle text-warning"
                                : "bg-primary-subtle text-primary"
                            }`}
                          >
                            {d.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumDeposit;
