import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { FaDownload, FaPhoneAlt, FaEnvelope, FaCreditCard, FaFileUpload } from 'react-icons/fa';

const PolicyViewPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const documents = [
    {
      title: "Policy Certificate",
      type: "PDF Document",
      date: "Jan 15, 2024",
      size: "2.4 MB"
    },
    {
      title: "Premium Receipt",
      type: "PDF Document",
      date: "Jan 15, 2024",
      size: "156 KB"
    },
    {
      title: "Medical Reports",
      type: "PDF Document",
      date: "Dec 20, 2023",
      size: "1.8 MB"
    },
  ];

  return (
    <div className="dashboard-layout policy-view-page">
      <Sidebar />
      <div className="main-content px-4 pt-4 pb-5">
        {/* Header */}
        <div className="policy-summary-card d-flex justify-content-between align-items-center flex-wrap">
          <div className="left-info">
            <h5 className="title">Comprehensive Life Insurance Plan</h5>
            <div className="sub-info d-flex align-items-center gap-3">
              <span className="text-muted">Life Insurance</span>
              <span className="policy-id text-muted">#LIC-2024-789456</span>
              <span className="badge-pill">Due Soon</span>
            </div>

            <div className="d-flex gap-4 mt-3">
              <div>
                <div className="label">Policy Period</div>
                <div className="value"><i className="bi bi-calendar2-event me-1" />Jan 15, 2024 — Jan 15, 2044</div>
              </div>
              <div>
                <div className="label">Premium</div>
                <div className="value"><i className="bi bi-currency-rupee me-1" />₹25,000 / Annual</div>
              </div>
            </div>
          </div>

          <div className="due-box">
            <div className="label text-danger"><i className="bi bi-exclamation-circle me-1" /> Next Payment Due</div>
            <div className="date text-danger fw-bold">Jan 15, 2025</div>
            <div className="note text-muted">Action required</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="policy-tabs d-flex mt-4">
          <button className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}>
            <i className="bi bi-person me-2"></i> Overview
          </button>
          <button className={activeTab === "documents" ? "active" : ""} onClick={() => setActiveTab("documents")}>
            <i className="bi bi-file-earmark-text me-2"></i> Documents
          </button>
          <button className={activeTab === "history" ? "active" : ""} onClick={() => setActiveTab("history")}>
            <i className="bi bi-clock-history me-2"></i> Payment History
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="row mt-4 gy-4">
            <div className="col-md-8">
              <div className="card-box mb-4">
                <h6 className="fw-bold mb-3"><i className="bi bi-person-fill me-2"></i>Policyholder Details</h6>
                <p><strong>Name</strong><br />Rajesh Kumar</p>
                <p><strong>Nominee</strong><br />Priya Kumar <span className="text-muted">(Spouse)</span></p>
                <p><strong>Sum Assured</strong><br /><span className="text-primary fw-bold">₹10,00,000</span></p>
              </div>

              <div className="card-box">
                <h6 className="fw-bold mb-3">Coverage Details</h6>
                <div className="d-flex flex-wrap gap-2">
                  {['Death Benefit', 'Accidental Death', 'Disability Cover', 'Tax Benefits'].map((item, i) => (
                    <span key={i} className="benefit-pill">{item}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="quick-actions-card">
                <h6 className="section-title">Quick Actions</h6>
                <button className="action-btn primary-btn w-100 mb-2"><FaDownload className="me-2" />Download Policy PDF</button>
                <button className="action-btn pay-btn w-100 mb-2"><FaCreditCard className="me-2" />Pay Premium Now</button>
                <button className="action-btn outline-btn w-100 mb-3">📞 Contact Support</button>
                <div className="help-text">Need Help?</div>
                <div className="chat-link">💬 Chat with Agent</div>
              </div>
            </div>

            <div className="col-12">
              <div className="card-box">
                <h6 className="fw-bold mb-3">Agent & Company Details</h6>
                <div className="row">
                  <div className="col-md-4">
                    <p><strong>Insurance Agent</strong><br />Amit Sharma</p>
                    <div className="d-flex gap-2 mt-2">
                      <button className="btn btn-sm btn-outline-primary"><FaPhoneAlt className="me-1" /> +91 98765 43210</button>
                      <button className="btn btn-sm btn-outline-primary"><FaEnvelope className="me-1" /> Email</button>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <p><strong>Company</strong><br />SecureLife Insurance Ltd.</p>
                    <p><strong>Branch</strong><br />Mumbai Central Branch</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <div className="card-box mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold">Policy Documents</h6>
              <button className="btn btn-sm btn-outline-primary">
                <FaFileUpload className="me-2" />
                Upload Document
              </button>
            </div>
            <div className="row">
              {documents.map((doc, i) => (
                <div key={i} className="col-md-4 mb-3">
                  <div className="doc-card">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="icon text-primary"><i className="bi bi-file-earmark-pdf"></i></div>
                      <div className="download-icon text-muted"><FaDownload /></div>
                    </div>
                    <div className="doc-info mt-2">
                      <div className="fw-semibold">{doc.title}</div>
                      <div className="text-muted small">{doc.type}</div>
                      <div className="text-muted small">Uploaded: {doc.date}</div>
                      <div className="text-muted small">{doc.size}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment History Placeholder */}
        {activeTab === "history" && (
          <div className="card-box mt-4">
            <h6 className="fw-bold">Payment History</h6>
            <p className="text-muted">Coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyViewPage;
