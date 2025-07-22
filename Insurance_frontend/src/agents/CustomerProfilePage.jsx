import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";

const CustomerProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [customer, setCustomer] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    address: "",
    dob: "",
  });

  useEffect(() => {
  const fetchCustomer = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/customer/${id}`);
      if(!res.ok) {
        throw new Error("Failed to fetch customer data");
      }
      const data = await res.json();
       const formattedCustomer = {
        name: data.customerName,
        email: data.customerEmail,
        contact: data.customerPhone,
        address: data.customerAddress || "-",
        dob: data.customerDOB || "-",
        policies: [data], // Wrap the current policy into an array
      };
      setCustomer(formattedCustomer);
    } catch (err) {
      console.error("❌ Error fetching customer data:", err);
    }
  };
  if (id) {
    fetchCustomer();
  }
  }, [id])



  if (!customer) return <div className="container py-4">Loading...</div>;

  const totalPremium = customer.policies.reduce(
    (sum, policy) => sum + Number(policy.premium || 0),
    0
  );

  const nextDue = customer.policies.reduce((latest, policy) => {
    const due = new Date(policy.dueDate);
    return !latest || due < new Date(latest) ? policy.dueDate : latest;
  }, null);

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/customer/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const updated = await res.json();
      setCustomer(updated);
      setShowEditModal(false);
    } else {
      console.error("❌ Failed to update customer");
    }
  } catch (err) {
    console.error("❌ Error updating customer:", err);
  }
};


  return (
    <div className="customer-profile container py-4">
      <div className="d-flex justify-content-between flex-wrap align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-light border d-flex align-items-center gap-2" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left"></i> Back to Customers
          </button>
          <div>
            <h3 className="fw-bold mb-0">
              <i className="bi bi-person-circle text-success me-2"></i>
              {customer.name}
            </h3>
            <small className="text-muted d-block">Customer ID: {parseInt(id) + 1}</small>
          </div>
        </div>
        <div className="d-flex gap-2 mt-3 mt-md-0">
          <button className="btn btn-outline-secondary">
            <i className="bi bi-envelope me-1"></i> Send Reminder
          </button>
          <button className="btn btn-success">
            <i className="bi bi-download me-1"></i> Export Data
          </button>
        </div>
      </div>

      <ul className="nav custom-tabs p-1 mb-4 rounded bg-light-subtle">
        {["overview", "policies", "history", "documents"].map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link px-4 py-2 rounded ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      {activeTab === "overview" && (
        <div className="row">
          <div className="col-md-8">
            <div className="bg-white rounded shadow-sm p-4 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Personal Information</h5>
                <button className="btn btn-sm btn-outline-primary" onClick={() => setShowEditModal(true)}>
                  <i className="bi bi-pencil-square me-1"></i> Edit
                </button>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="text-muted small">Phone</div>
                  <div className="fw-semibold mb-3">{customer.contact}</div>
                </div>
                <div className="col-md-6">
                  <div className="text-muted small">Email</div>
                  <div className="fw-semibold mb-3">{customer.email || "-"}</div>
                </div>
                <div className="col-md-6">
                  <div className="text-muted small">Address</div>
                  <div className="fw-semibold mb-3">{customer.address || "-"}</div>
                </div>
                <div className="col-md-6">
                  <div className="text-muted small">Date of Birth</div>
                  <div className="fw-semibold mb-3">{customer.dob || "-"}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded shadow-sm p-4">
              <h5 className="fw-bold mb-3">Insurance Summary</h5>
              {customer.policies.map((p, i) => (
                <div key={i} className="border rounded p-3 mb-3">
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>{p.type}</strong>
                      <p className="mb-0 small">{p.schemeName || ""}</p>
                      <p className="mb-0 small">{p.startDate} - {p.dueDate}</p>
                    </div>
                    <div className="text-end">
                      <span className="badge bg-success-subtle text-success mb-1">active</span>
                      <div className="fw-semibold text-success">₹{p.premium}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-md-4">
            <div className="bg-white rounded shadow-sm p-4 mb-4">
              <h5 className="fw-bold mb-3">Quick Stats</h5>
              <div className="mb-2">
                <div className="text-muted small">Total Policies</div>
                <div className="fw-bold fs-5 text-success">{customer.policies.length}</div>
              </div>
              <div className="mb-2">
                <div className="text-muted small">Total Premium Paid</div>
                <div className="fw-bold fs-5 text-success">₹{totalPremium.toLocaleString()}</div>
              </div>
              <div className="mb-2">
                <div className="text-muted small">Upcoming Dues (7 days)</div>
                <div className="fw-bold fs-5 text-danger">
                  {
                    customer.policies.filter(p => {
                      const due = new Date(p.dueDate);
                      const now = new Date();
                      const diff = (due - now) / (1000 * 3600 * 24);
                      return diff >= 0 && diff <= 7;
                    }).length
                  }
                </div>
              </div>
            </div>

            <div className="bg-white rounded shadow-sm p-4">
              <h5 className="fw-bold mb-3">Notes</h5>
              <div className="bg-light rounded p-2 mb-2 small">
                High-value customer with excellent payment history
              </div>
              <div className="bg-light rounded p-2 mb-2 small">
                Interested in expanding life insurance coverage
              </div>
              <div className="bg-light rounded p-2 small">
                Prefers digital communication
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Personal Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleEditChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomerProfilePage;
