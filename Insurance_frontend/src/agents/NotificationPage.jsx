import React, { useState,useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { FaPhone, FaSearch } from "react-icons/fa";
import { Modal, Button, Toast, ToastContainer } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

const NotificationPage = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const [customers, setCustomers] = useState([]);


  const [searchTerm, setSearchTerm] = useState("");
  const [occasionFilter, setOccasionFilter] = useState("All Occasions");
  const [monthFilter, setMonthFilter] = useState("All Months");

  const [showModal, setShowModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [wishMessage, setWishMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [readNotifications, setReadNotifications] = useState(new Set());



  //handleClick
  const handleWishClick = (person, type) => {
    setSelectedPerson(person);
    const defaultMessage = `Send Custom message`;
    setWishMessage(defaultMessage);
    setShowModal(true);
  };

  const handleSendMessage = async (person, message) => {
    try {
      const res = await fetch("http://localhost:5000/v1/notification/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: message,
          phone: person.customerPhone,
          agentId: person.agentId,
          policyId: person._id || null
        })
      });

       // Immediately fetch latest notifications
          fetchNotification();
          if (!res.ok) {
        throw new Error("Failed to send notification");
      }

      alert(`✅ ${ "Message sent successfully!"}`);
    } catch (error) {
      alert("❌ Failed to send notifications");
      console.log(error)
    }
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
     
      // console.log("agentId",agent.id)
          const customerList = await fetch(`http://localhost:5000/api/agent/${agent.id}`);
        const data = await customerList.json();
          if (customerList.ok && Array.isArray(data)) {
            console.log("✅ Filtered Policies:", data);
            setCustomers(data);
          } else {
            console.warn("⚠️ Unexpected policy data structure:", data);
          }
        } catch (err) {
          console.error("🚫 Failed to fetch policies:", err);
        }
      };
      fetchPolicies();
    }, []);

  // const birthdays = [
  //   { initials: "RK", name: "Rajesh Kumar", email: "rajesh.kumar@email.com", date: "15 July", age: "Turning 40", policy: "LIC123456789", phone: "+91 98765 43210" },
  //   { initials: "PS", name: "Priya Sharma", email: "priya.sharma@email.com", date: "22 July", age: "Turning 35", policy: "LIC987654321", phone: "+91 87564 32109" },
  //   { initials: "AP", name: "Amit Patel", email: "amit.patel@email.com", date: "28 July", age: "Turning 37", policy: "LIC456789123", phone: "+91 75643 21098" },
  // ];


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

  // const filteredBirthdays = birthdays.filter(
  //   (item) =>
  //     (occasionFilter === "All Occasions" || occasionFilter === "Birthday") &&
  //     (monthFilter === "All Months" || filterMonth(item.date) === monthFilter) &&
  //     matchSearch(item, ["name", "email", "phone", "policy"])
  // );

  // const filteredFestivals = festivals.filter(
  //   (item) =>
  //     (occasionFilter === "All Occasions" || occasionFilter === "Festivals") &&
  //     (monthFilter === "All Months" || filterMonth(item.date) === monthFilter) &&
  //     matchSearch(item, ["title", "desc"])
  // );

  const handleClear = () => {
    setSearchTerm("");
    setOccasionFilter("All Occasions");
    setMonthFilter("All Months");
  };

  // Log Filter Conditions


  const [activeTab, setActiveTab] = useState("All");
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

    const [logs, setLogs] = useState([]); // ✅ Store logs properly in state

  // ✅ ADDED: Calculate unread notifications count
  const unreadCount = logs.filter(log => !readNotifications.has(log.notificationId)).length;

  // ✅ ADDED: Function to mark notification as read
  const markAsRead = (notificationId) => {
    setReadNotifications(prev => new Set([...prev, notificationId]));
  };

  // ✅ ADDED: Function to mark all notifications as read
  const markAllAsRead = () => {
    const allNotificationIds = logs.map(log => log.notificationId);
    setReadNotifications(new Set(allNotificationIds));
  };

  // ✅ ADDED: Function to check if notification is read
  const isNotificationRead = (notificationId) => {
    return readNotifications.has(notificationId);
  };

  const fetchNotification = async () => {
            const agent = user || JSON.parse(localStorage.getItem("user"));
          if (!agent?.id) {
            console.warn("❌ Agent ID not found.");
            return;
          }

        const response = await fetch(`http://localhost:5000/v1/notification/fetch-notification/${agent.id}`);
      const notification_list = await response.json();
      if (notification_list?.data) {
        setLogs(notification_list.data); 
      }
   if (activeTab === "All") {
    // Return all logs as-is, including those with missing or null occasion
    setFilteredLogs(notification_list.data || []);
} else {
    // Filter only when a specific tab is selected
    setFilteredLogs(
        (notification_list.data || []).filter((log) => log.occasion?.toString().trim() === activeTab)
    );
}
        };

  // Handle Tab Filter
  useEffect(() => {
    fetchNotification();
  }, [activeTab]);



  // ✅ useEffect for fetching on mount or tab change
  // ✅ MODIFIED: Updated handleViewLog to mark notification as read when viewed
  const handleViewLog = (log) => {
    setSelectedLog(log);
    setShowLogModal(true);
    // ✅ ADDED: Mark this notification as read when viewing
    markAsRead(log.notificationId);
  };

  // ✅ ADDED: Function to handle viewing all notifications (called when visiting notification page)
  const handleViewAllNotifications = () => {
    markAllAsRead();
  };

  useEffect(() => {
    // This simulates visiting the notification page and marking all as read
    // You can call this function when user clicks on notifications in sidebar
     handleViewAllNotifications();
  }, []);

  return (
    <div className="dashboard-layout notification-page-wrapper d-flex">
      <Sidebar isOpen={sidebarOpen} 
      toggleSidebar={toggleSidebar}  
       unreadNotificationCount={unreadCount} 
        onNotificationClick={handleViewAllNotifications} // ✅ ADDED: Pass function to mark all as read
 />
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
              <button className="btn View__btn w-100">Apply</button>
            </div>
            <div className="col-md-1">
              <button className="btn btn-secondary w-100" onClick={handleClear}>Clear</button>
            </div>
          </div>
        </div>

        {/* Birthday Table */}
        {/* {(occasionFilter === "All Occasions" || occasionFilter === "Birthday") && (
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
        )} */}

        {/*  Section */}
        {/* Customer List Section */}
        {(occasionFilter === "All Occasions" || occasionFilter === "Anniversary") && (
          <div className="notification-table-container mt-4">
            <h6 className="fw-semibold mb-3">
              PolicyHolder <span className="badge bg-light text-dark">{customers.length}</span>
            </h6>
            <div className="table-container">
              <table className="table">
                <thead className="table-light table-bordered">
                  <tr>
                    <th>Name</th>
                    <th>Policy Number</th>
                    <th>Contact</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((item, i) => (
                    <tr key={item._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar bg-info text-white me-2">{item.customerName?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong>{item.customerName}</strong><br />
                            <small className="text-muted">{item.customerEmail}</small>
                          </div>
                        </div>
                      </td>
                      <td>{item.policyNumber}</td>
                      <td><FaPhone className="me-1" />{item.customerPhone}</td>
                      <td>
                        <button className="btn View__btn btn-sm" onClick={() => handleWishClick(item, "Anniversary")}>Send Custom Messages</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Festival Section */}
        {/* {(occasionFilter === "All Occasions" || occasionFilter === "Festivals") && (
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
              )} */}

        {/* Notification Logs Table */}
       <div className="notification-logs-container mt-4 p-4 shadow-sm">
  <h6 className="fw-semibold mb-3 text-primary">Notification Logs</h6>

  {/* Tabs and Record Count */}
  <div className="d-flex justify-content-between align-items-center mb-3">
    <div className="tabs">
      {["All", "Birthday", "Policy Due", "Custom"].map((tab) => (
        <button
          key={tab}
          className={`tab-btn ${activeTab === tab ? "active" : ""}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
    <div className="records-count text-muted small">
      {filteredLogs.length} records
    </div>
  </div>

  {/* ✅ Striped & Bordered Table */}
  <div className="table-container">
    <table className="table table-striped table-bordered align-middle">
      <thead className="table-light">
        <tr>
          <th>NAME & EMAIL</th>
          <th>POLICY DETAILS</th>
          <th>POLICY No.</th>
          <th>CONTACT No.</th>
          <th>OCCASION</th>
          <th>ACTION</th>
        </tr>
      </thead>
      <tbody>
        {filteredLogs.map((log) => (
          <tr key={log.notificationId}>
            <td>
              <strong>{log.customerName}</strong>
              <br />
              <small className="text-muted">{log.customerEmail}</small>
            </td>

            <td>
              <div>
                <strong>{log.company || "LIC India"}</strong>
                <br />
                <small className="text-muted">
                  {log.policyType || "Jeevan Anand Plan"}
                </small>
              </div>
            </td>

            <td>{log.policyNumber}</td>
            <td>
              <FaPhone className="me-1 text-danger" />
              {log.customerPhone}
            </td>
            <td>
              {log.occasion === "Birthday" && <span>🎂 Birthday</span>}
              {log.occasion === "Policy Due" && <span>📅 Policy Due</span>}
              {log.occasion === "Custom" && <span>✉️ Custom</span>}
            </td>
            <td>
              <button
                className="btn View__btn btn-sm d-flex align-items-center gap-2"
                onClick={() => handleViewLog(log)}
              >
                View Message
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


        {/* Log View Modal */}
        <Modal show={showLogModal} onHide={() => setShowLogModal(false)} centered className="view-log-modal">
          <Modal.Header closeButton>
            <Modal.Title>
              Message Details - <span className="text-dark">{selectedLog?.name}</span>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {/* Message Box */}
            <div className="message-box p-3 mb-4 rounded">
              <strong className="d-block mb-2">Message Sent:</strong>
              <p className="text-muted m-0">{selectedLog?.message}</p>
            </div>

            {/* Details Grid */}
            <div className="row g-3">
              <div className="col-6">
                <p className="mb-1 text-muted small">Date & Time:</p>
                <p className="fw-semibold">{selectedLog?.createdAt}</p>
              </div>
              <div className="col-6">
                <p className="mb-1 text-muted small">Status:</p>
                <span className="badge status-badge px-3 py-2">
                  ✅ {selectedLog?.status}
                </span>
              </div>
              <div className="col-6">
                <p className="mb-1 text-muted small">Occasion:</p>
                <p className="fw-semibold">🎉 {selectedLog?.occasion}</p>
              </div>
              <div className="col-6">
                <p className="mb-1 text-muted small">Policy:</p>
                <p className="fw-semibold">{selectedLog?.policyNumber}</p>
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <button className="btn btn-light w-100 close-btn" onClick={() => setShowLogModal(false)}>
              Close
            </button>
          </Modal.Footer>
        </Modal>


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
<Button
  variant="dark"
  onClick={() => handleSendMessage(selectedPerson, wishMessage)}
>
  Send Message
</Button>          </Modal.Footer>
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
