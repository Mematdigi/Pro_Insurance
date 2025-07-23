import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { FaUserPlus } from 'react-icons/fa';
import { BsShieldCheck, BsGift } from 'react-icons/bs';
import { MdOutlineNotificationsActive } from 'react-icons/md';

const categories = ['Motor', 'Health', 'Personal Accident', 'Home', 'Travel', 'Life Insurance'];

const sampleData = {
  Motor: [
    {
      name: 'Monu Kumar',
      type: 'Car Insurance',
      details: 'Sed ut perspiciatis unde omnis iste',
      premium: '50,000',
      due: '12 Dec 2025',
    },

    {
      name: 'Kavita Singh',
      type: 'Car Insurance',
      details: 'Sed ut perspiciatis unde omnis iste',
      premium: '50,000',
      due: '12 Dec 2025',
    },
    
  ],
  Health: [
    {
      name: 'Ravi Sharma',
      type: 'Health Insurance',
      details: 'Complete health protection plan',
      premium: '30,000',
      due: '05 Jan 2026',
    },
    {
      name: 'Ravi Kumar',
      type: 'Car Insurance',
      details: 'Sed ut perspiciatis unde omnis iste',
      premium: '50,000',
      due: '12 Dec 2025',
    },
  ],
  'Personal Accident': [
    {
      name: 'Anjali Mehta',
      type: 'Accident Cover',
      details: 'Accidental injury support plan',
      premium: '20,000',
      due: '19 Aug 2025',
    },
    {
      name: 'Ravi Kumar',
      type: 'Car Insurance',
      details: 'Sed ut perspiciatis unde omnis iste',
      premium: '50,000',
      due: '12 Dec 2025',
    },
  ],
  Home: [
    {
      name: 'Rohan Gupta',
      type: 'Home Insurance',
      details: 'Coverage for natural disasters',
      premium: '60,000',
      due: '30 Mar 2026',
    },
    {
      name: 'Ravi Kumar',
      type: 'Car Insurance',
      details: 'Sed ut perspiciatis unde omnis iste',
      premium: '50,000',
      due: '12 Dec 2025',
    },
  ],
};

const Dashboard = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Motor');
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="dashboard-layout d-flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="main-content p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start flex-wrap">
          <div>
            <h2 className="fw-bold text-primary">Hello User</h2>
            <p className="text-muted">Welcome to the Dashboard</p>
          </div>
          <div className="user-profile-card bg-white p-3 rounded-4 d-flex align-items-center gap-3 shadow-sm">
            <img src="https://i.pravatar.cc/50" className="rounded-circle" alt="user" />
            <div>
              <div className="fw-bold text-capitalize">monu kumar</div>
              <div className="text-muted small">Premium Customer</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
       <div className="tab-bar d-flex gap-4 mt-4">
  {categories.map((cat) => (
    <div
      key={cat}
      className={`tab-item ${activeTab === cat ? 'active' : ''}`}
      onClick={() => setActiveTab(cat)}
    >
      {cat}
    </div>
  ))}
</div>


        {/* Insurance Cards */}
        <div className="row mt-4">
          {sampleData[activeTab]?.map((item, idx) => (
            <div className="col-md-4 mb-3" key={idx}>
              <div className="policy-card p-4 rounded-4 bg-white border shadow-sm">
                <h6 className="fw-bold text-primary">{item.name}</h6>
                <div className="text-dark fw-semibold">{item.type}</div>
                <div className="text-muted small mb-3">{item.details}</div>
                <div><strong>Premium:</strong> <span className="ms-2">{item.premium}</span></div>
                <div><strong>Premium Due:</strong> <span className="ms-2">{item.due}</span></div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-box bg-white p-4 rounded-4 shadow-sm mt-4">
          <h5 className="fw-bold mb-4">Quick Actions</h5>
          <div className="row g-3">
            <div className="col-md-3 col-6">
              <div className="action-card bg-success-subtle text-center p-3 rounded-3 h-100">
                <FaUserPlus size={24} className="text-success mb-2" />
                <div className="fw-semibold text-dark">Add Customer</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="action-card bg-primary-subtle text-center p-3 rounded-3 h-100">
                <BsShieldCheck size={24} className="text-primary mb-2" />
                <div className="fw-semibold text-dark">Assign Policy</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="action-card bg-success-subtle text-center p-3 rounded-3 h-100">
                <MdOutlineNotificationsActive size={24} className="text-success mb-2" />
                <div className="fw-semibold text-dark">Send Reminder</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="action-card bg-primary-subtle text-center p-3 rounded-3 h-100">
                <BsGift size={24} className="text-primary mb-2" />
                <div className="fw-semibold text-dark">View Rewards</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
