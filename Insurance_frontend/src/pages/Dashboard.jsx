import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import slider1 from "/public/slider1.png";
import slider2 from "/public/slider2.png";
import slider3 from "/public/slider3.png";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  const sliders = [slider1, slider2, slider3];

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % sliders.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);



  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      {sidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}

      <div className="main-content">
        <Header toggleSidebar={toggleSidebar} />
        <div className="page-body">
          <div className="dashboard-widgets">
            <div className="left">
              <div className="insurance-slider">
                <img src={sliders[slideIndex]} alt="insurance-slide" />
              </div>

             {/* === All Insurance Policies Section === */}
              {/* === All Insurance Policies Section === */}
                <div className="insurance-header d-flex justify-content-between align-items-center mb-4 mt-4">
                  <h4 className="section-title">All Your Insurance Policies</h4>
                  <button className="btn add-policy-btn" onClick={() => navigate("/add-insurance")}>
                      ＋ Add Existing Insurance
                    </button>
                </div>

                <div className="row insurance-policy-cards">
                  {[
                    {
                      title: "Jeevan Anand",
                      company: "LIC",
                      policyNumber: "LIC123456789",
                      sumAssured: "₹5,00,000",
                      premiumDue: "15 Jul 2024",
                      tag: "Endowment",
                      tagColor: "success",
                    },
                  
                    {
                      title: "Smart Health Insurance",
                      company: "ICICI Lombard",
                      policyNumber: "ICICI55566777",
                      sumAssured: "₹3,00,000",
                      premiumDue: "20 Aug 2024",
                      tag: "Health",
                      tagColor: "danger",
                    },
                  ].map((item, idx) => (
                    <div className="col-md-6 col-sm-6 col-12 mb-4" key={idx}>
                      <div className="insurance-card shadow-sm p-3 h-100 rounded-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5 className="mb-0 fw-semibold">{item.title}</h5>
                          <span className={`badge bg-${item.tagColor} bg-opacity-10 text-${item.tagColor} px-3 py-1 rounded-pill`}>
                            {item.tag}
                          </span>
                        </div>
                        <p className="mb-1 text-muted">{item.company}</p>
                        <div className="d-flex justify-content-between small mb-3">
                          <div>
                            <div className="text-muted">Policy Number</div>
                            <div className="fw-bold">{item.policyNumber}</div>
                          </div>
                          <div>
                            <div className="text-muted">$ Sum Assured</div>
                            <div className="fw-bold">{item.sumAssured}</div>
                          </div>
                        </div>
                        <div className="premium-box bg-light d-flex align-items-center p-2 rounded-2 mb-3">
                          <i className="bi bi-calendar3 me-2"></i>
                          <span className="fw-semibold me-2">Premium Due</span>
                          <span className="text-muted small">{item.premiumDue}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center gap-2">
                          <button className="btn btn-outline-secondary btn-sm w-100">
                            <i className="bi bi-eye me-1"></i> View
                          </button>
                          <button className="btn btn-outline-secondary btn-sm w-100">
                            <i className="bi bi-pencil me-1"></i> Edit
                          </button>
                          <button className="btn btn-outline-secondary btn-sm w-100">
                            <i className="bi bi-trash me-1"></i> 
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>



             
                  </div>
              {/* ...Keep rest of the code here as you already have it... */}
              <div className="right">
              <div className="due-box">
                <h4>Next Upcoming Event</h4>
                <img
                  src="/public/upcoming_ads.jpg"
                  alt="event"
                  style={{ width: "100%", borderRadius: "8px", marginBottom: "10px" }}
                />
                <p>🎉 Insurance Festival – 12-16 Dec</p>
                <p>📦 Free claim consultation</p>
                <button className="quick-action-btn" style={{ marginTop: "10px" }}>
                  View Event Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
