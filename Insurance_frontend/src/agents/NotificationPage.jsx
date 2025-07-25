import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { FaPhone, FaSearch } from "react-icons/fa";
import { Modal, Button, Toast, ToastContainer } from "react-bootstrap";


const NotificationPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [searchTerm, setSearchTerm] = useState("");
  const [occasionFilter, setOccasionFilter] = useState("All Occasions");
  const [monthFilter, setMonthFilter] = useState("All Months");

  const [showModal, setShowModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [wishMessage, setWishMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleWishClick = (person, type) => {
    setSelectedPerson(person);
    const defaultMessage = type === "Anniversary"
      ? `Happy Anniversary ${person.name}! Wishing you many more years of happiness together.`
      : `Happy Birthday ${person.name}! Wishing you a healthy and prosperous year ahead.`;
    setWishMessage(defaultMessage);
    setShowModal(true);
  };

  const handleSendMessage = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/notifications/send");
      const data = await res.json();
      console.log("Response",data);
      alert(`✅ ${data.message || "Wish sent successfully!"}`);
  } catch (error) {
    alert("❌ Failed to send notifications");
  }
};


  const birthdays = [
    { initials: "RK", name: "Rajesh Kumar", email: "rajesh.kumar@email.com", date: "15 July", age: "Turning 40", policy: "LIC123456789", phone: "+91 98765 43210" },
    { initials: "PS", name: "Priya Sharma", email: "priya.sharma@email.com", date: "22 July", age: "Turning 35", policy: "LIC987654321", phone: "+91 87564 32109" },
    { initials: "AP", name: "Amit Patel", email: "amit.patel@email.com", date: "28 July", age: "Turning 37", policy: "LIC456789123", phone: "+91 75643 21098" },
  ];

  const anniversaries = [
    { initials: "SG", name: "Suresh & Sunita Gupta", email: "suresh.gupta@email.com", date: "20 July", years: "11 years", policy: "LIC111223333", phone: "+91 65432 10987" },
    { initials: "VS", name: "Vikram & Kavita Singh", email: "vikram.singh@email.com", date: "25 July", years: "15 years", policy: "LIC444555666", phone: "+91 54321 08796" },
    { initials: "AK", name: "Anil & Kiran Mehra", email: "anil.kiran@email.com", date: "5 July", years: "18 years", policy: "LIC999888777", phone: "+91 99887 76655" },
    { initials: "RD", name: "Ravi & Divya Chauhan", email: "ravi.divya@email.com", date: "8 July", years: "9 years", policy: "LIC777666555", phone: "+91 88776 55443" },
    { initials: "PK", name: "Pankaj & Komal Jain", email: "pankaj.komal@email.com", date: "12 July", years: "13 years", policy: "LIC888999000", phone: "+91 77665 44332" },
    { initials: "LM", name: "Lakshya & Meera Bhatia", email: "lakshya.meera@email.com", date: "15 July", years: "7 years", policy: "LIC666555444", phone: "+91 66554 33221" },
    { initials: "SR", name: "Sameer & Ritu Taneja", email: "sameer.ritu@email.com", date: "18 July", years: "10 years", policy: "LIC555444333", phone: "+91 55443 22110" },
    { initials: "NA", name: "Nitin & Ananya Seth", email: "nitin.ananya@email.com", date: "21 July", years: "14 years", policy: "LIC444333222", phone: "+91 44332 11009" },
    { initials: "VB", name: "Varun & Bhavna Shah", email: "varun.bhavna@email.com", date: "27 July", years: "12 years", policy: "LIC333222111", phone: "+91 33221 00998" },
    { initials: "HM", name: "Harish & Manju Goel", email: "harish.manju@email.com", date: "30 July", years: "16 years", policy: "LIC222111000", phone: "+91 22110 09887" },
  ];

  const festivals = [
    { title: "Janmashtami", desc: "Birthday of Lord Krishna", date: "26 August" },
    { title: "Ganesh Chaturthi", desc: "Festival of Lord Ganesha", date: "7 September" },
    { title: "Diwali", desc: "Festival of Lights", date: "1 November" },
  ];

  const filterMonth = (date) => date?.split(" ")[1];

  const matchSearch = (item, keys) => {
    const q = searchTerm.toLowerCase();
    return keys.some((key) => item[key]?.toLowerCase().includes(q));
  };

  const filteredBirthdays = birthdays.filter(
    (item) =>
      (occasionFilter === "All Occasions" || occasionFilter === "Birthday") &&
      (monthFilter === "All Months" || filterMonth(item.date) === monthFilter) &&
      matchSearch(item, ["name", "email", "phone", "policy"])
  );

  const filteredAnniversaries = anniversaries.filter(
    (item) =>
      (occasionFilter === "All Occasions" || occasionFilter === "Anniversary") &&
      (monthFilter === "All Months" || filterMonth(item.date) === monthFilter) &&
      matchSearch(item, ["name", "email", "phone", "policy"])
  );

  const filteredFestivals = festivals.filter(
    (item) =>
      (occasionFilter === "All Occasions" || occasionFilter === "Festivals") &&
      (monthFilter === "All Months" || filterMonth(item.date) === monthFilter) &&
      matchSearch(item, ["title", "desc"])
  );

  const handleClear = () => {
    setSearchTerm("");
    setOccasionFilter("All Occasions");
    setMonthFilter("All Months");
  };

  return (
    <div className="dashboard-layout notification-page-wrapper d-flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="main-content p-4 w-100 notification-page">
        <div className="top-banner p-4 mb-4 shadow-sm d-flex justify-content-between align-items-center">
          <div>
            <h5 className="fw-bold mb-1">✨ Stay Connected with Your Customers!</h5>
            <p className="text-muted">Send warm wishes on their special days and festivals to strengthen your relationships.</p>
          </div>
          <img src="/public/family-life-insurance-illustration.png" alt="Celebration" height="100" />
        </div>

        {/* Filter Section */}
        <div className="filter-section p-4 mb-4 shadow-sm">
          <h6 className="fw-semibold text-dark mb-3">🎯 Advanced Search & Filters</h6>
          <div className="row g-3 align-items-end">
            <div className="col-md-6 position-relative">
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="form-control ps-4"
                placeholder="Search customers by name or policy number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <select className="form-select" value={occasionFilter} onChange={(e) => setOccasionFilter(e.target.value)}>
                <option>All Occasions</option>
                <option>Birthday</option>
                <option>Anniversary</option>
                <option>Festivals</option>
              </select>
            </div>
            <div className="col-md-2">
              <select className="form-select" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
                <option>All Months</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i}>
                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-1">
              <button className="btn btn-dark w-100">Apply</button>
            </div>
            <div className="col-md-1">
              <button className="btn btn-secondary w-100" onClick={handleClear}>Clear</button>
            </div>
          </div>
        </div>

        {/* Birthday Table */}
        {(occasionFilter === "All Occasions" || occasionFilter === "Birthday") && (
          <div className="notification-table-container">
            <h6 className="fw-semibold mb-3">🎁 Upcoming Birthdays <span className="badge bg-light text-dark">{filteredBirthdays.length}</span></h6>
            <div className="table-container">
              <table className="table">
                <thead className="table-light table-bordered">
                  <tr>
                    <th>Customer</th>
                    <th>Date & Age</th>
                    <th>Policy Number</th>
                    <th>Contact</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBirthdays.map((item, i) => (
                    <tr key={i}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar bg-dark text-white me-2">{item.initials}</div>
                          <div>
                            <strong>{item.name}</strong><br />
                            <small className="text-muted">{item.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>{item.date}<br /><span className="text-muted">{item.age}</span></td>
                      <td>{item.policy}</td>
                      <td><FaPhone className="me-1" />{item.phone}</td>
                      <td>
                        <button className="btn btn-dark btn-sm" onClick={() => handleWishClick(item)}>Send Wish</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Anniversary Section */}
        {(occasionFilter === "All Occasions" || occasionFilter === "Anniversary") && (
          <div className="notification-table-container mt-4">
            <h6 className="fw-semibold mb-3">
              💖 Upcoming Anniversaries <span className="badge bg-light text-dark">{filteredAnniversaries.length}</span>
            </h6>
            <div className="table-container">
              <table className="table">
                <thead className="table-light table-bordered">
                  <tr>
                    <th>Couple</th>
                    <th>Date & Years</th>
                    <th>Policy Number</th>
                    <th>Contact</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAnniversaries.map((item, i) => (
                    <tr key={i}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar bg-danger text-white me-2">{item.initials}</div>
                          <div>
                            <strong>{item.name}</strong><br />
                            <small className="text-muted">{item.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>{item.date}<br /><span className="text-muted">{item.years}</span></td>
                      <td>{item.policy}</td>
                      <td><FaPhone className="me-1" />{item.phone}</td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => handleWishClick(item, "Anniversary")}>Send Wish</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Festival Section */}
        {(occasionFilter === "All Occasions" || occasionFilter === "Festivals") && (
          <>
            <h6 className="fw-semibold text-dark mt-4">
              🎉 Festival Greetings <span className="badge bg-light text-dark">{filteredFestivals.length}</span>
            </h6>
            <div className="row g-3">
              {filteredFestivals.map((fest, index) => (
                <div className="col-md-4" key={index}>
                  <div className="card festival-card p-3 shadow-sm border-0 border-start border-5">
                    <h6 className="fw-semibold mb-1">{fest.title}</h6>
                    <p className="text-muted mb-1">{fest.desc}</p>
                    <p className="text-muted">{fest.date}</p>
                    <button className="btn btn-outline-dark w-100 btn-sm">Send Festival Wish to All</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Send Personalized Message</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Message for {selectedPerson?.name}</strong></p>
            <textarea
              rows={4}
              className="form-control"
              value={wishMessage}
              onChange={(e) => setWishMessage(e.target.value)}
            ></textarea>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="dark" onClick={handleSendMessage}>Send Message</Button>
          </Modal.Footer>
        </Modal>

        {/* Toast */}
        <ToastContainer className="p-3" position="bottom-end">
          <Toast
            bg="light"
            show={showToast}
            delay={3000}
            autohide
            onClose={() => setShowToast(false)}
          >
            <Toast.Header closeButton={false}>
              <strong className="me-auto">Wish sent successfully! 🎉</strong>
            </Toast.Header>
            <Toast.Body>
              Message sent to <strong>{selectedPerson?.name}</strong>
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </div>
    </div>
  );
};

export default NotificationPage;
