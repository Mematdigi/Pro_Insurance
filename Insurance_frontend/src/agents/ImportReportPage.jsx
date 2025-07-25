import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const ImportReportPage = () => {
  const [filters, setFilters] = useState({ date: "", company: "", type: "" });

  const importData = [
    {
      file: "life_insurance_customers_june.xlsx",
      date: "Jun 15, 2024",
      type: "Life Insurance",
      company: "MetLife",
      customers: 45,
      status: "Success",
    },
    {
      file: "health_insurance_batch_2.xlsx",
      date: "Jun 14, 2024",
      type: "Health Insurance",
      company: "Aetna",
      customers: 0,
      status: "Error",
    },
    {
      file: "auto_insurance_updates.xlsx",
      date: "Jun 12, 2024",
      type: "Auto Insurance",
      company: "State Farm",
      customers: 32,
      status: "Success",
    },
    {
      file: "home_insurance_new_clients.xlsx",
      date: "Jun 10, 2024",
      type: "Home Insurance",
      company: "Allstate",
      customers: 28,
      status: "Success",
    },
  ];

  return (
    <div className="import-page d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
        <Header />

        <div className="import-report-container">
          {/* Top Buttons */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <button className="btn btn-outline-primary d-flex align-items-center gap-2">
              <i className="bi bi-bell"></i> Due Payments
            </button>
            <button className="btn btn-primary d-flex align-items-center gap-2">
              <i className="bi bi-download"></i> Import Report
            </button>
          </div>

          {/* Filter Section */}
          <div className="filter-box bg-white p-4 rounded shadow-sm mb-4">
            <h6 className="fw-bold mb-3 text-primary d-flex align-items-center gap-2">
              <i className="bi bi-funnel-fill"></i> Import Filters
            </h6>
            <div className="row g-3">
              <div className="col-md-3">
                <input type="date" className="form-control" placeholder="Pick a date" />
              </div>
              <div className="col-md-3">
                <select className="form-select">
                  <option>Select company</option>
                </select>
              </div>
              <div className="col-md-3">
                <select className="form-select">
                  <option>Select type</option>
                </select>
              </div>
              <div className="col-md-3">
                <button className="btn btn-outline-secondary w-100">Clear All</button>
              </div>
            </div>
          </div>

          {/* Import Count Info */}
          <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
            <div className="text-muted d-flex align-items-center gap-2">
              <i className="bi bi-cloud-arrow-down-fill"></i> 4 import records found
            </div>
            <button className="btn btn-primary d-flex align-items-center gap-2">
              <i className="bi bi-upload"></i> Upload New File
            </button>
          </div>

          {/* Summary Cards */}
          {/* <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="summary-box border-start border-success bg-white shadow-sm p-3 rounded d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2 text-success">
                  <i className="bi bi-file-earmark-check-fill fs-4"></i>
                  <div>
                    <small className="d-block">Successful Imports</small>
                    <strong>3</strong>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="summary-box border-start border-danger bg-white shadow-sm p-3 rounded d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2 text-danger">
                  <i className="bi bi-file-earmark-x-fill fs-4"></i>
                  <div>
                    <small className="d-block">Failed Imports</small>
                    <strong>1</strong>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="summary-box border-start border-primary bg-white shadow-sm p-3 rounded d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2 text-primary">
                  <i className="bi bi-people-fill fs-4"></i>
                  <div>
                    <small className="d-block">Total Customers</small>
                    <strong>105</strong>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* Table */}
          <div className="table-box">
            <h6 className="fw-bold text-primary mb-3">Import History</h6>
            <div className="table-responsive bg-white shadow-sm rounded p-3">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>File Name</th>
                    <th>Upload Date</th>
                    <th>Insurance Type</th>
                    <th>Company</th>
                    <th>Customers</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {importData.map((row, i) => (
                    <tr key={i}>
                      <td><i className="bi bi-file-earmark-text"></i> {row.file}</td>
                      <td>{row.date}</td>
                      <td>{row.type}</td>
                      <td>{row.company}</td>
                      <td className="fw-bold text-primary">{row.customers}</td>
                      <td>
                        <span className={`badge rounded-pill bg-${row.status === "Success" ? "success" : "danger"}`}>
                          {row.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-2">
                          <button className="btn btn-outline-primary btn-sm">
                            <i className="bi bi-eye"></i> Preview
                          </button>
                          <button className="btn btn-outline-primary btn-sm">
                            <i className="bi bi-download"></i> Download
                          </button>
                        </div>
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
  );
};

export default ImportReportPage;
