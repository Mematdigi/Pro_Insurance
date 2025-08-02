import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Sidebar from "../components/Sidebar";

const MyPoliciesPage = () => {
  const [view, setView] = useState('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const navigate = useNavigate();
  

  const policies = [
    {
      company: 'HDFC Life',
      scheme: 'Click 2 Protect Life',
      amount: '₹50,000',
      status: 'Active',
      type: 'Life',
      term: '5 Years',
      startDate: '01 Jan 2023',
      endDate: '01 Jan 2028',
      nextDue: '01 Jan 2025',
      totalPaid: '₹1,00,000',
      color: '#dcfce7',
      initials: 'HD',
    },
    {
      company: 'ICICI Prudential',
      scheme: 'iProtect Smart',
      amount: '₹75,000',
      status: 'Renewed',
      type: 'Term',
      term: '10 Years',
      startDate: '15 Mar 2022',
      endDate: '15 Mar 2032',
      nextDue: '15 Mar 2025',
      totalPaid: '₹2,25,000',
      color: '#fefce8',
      initials: 'IC',
    },
    {
      company: 'LIC India',
      scheme: 'Jeevan Anand',
      amount: '₹30,000',
      status: 'Lapsed',
      type: 'Life',
      term: '5 Years',
      startDate: '10 Apr 2020',
      endDate: '10 Apr 2025',
      nextDue: '10 Apr 2024',
      totalPaid: '₹1,20,000',
      color: '#fef2f2',
      initials: 'LI',
    },
    {
      company: 'Bajaj Allianz',
      scheme: 'Life Goal Assure',
      amount: '₹60,000',
      status: 'Active',
      type: 'Health',
      term: '15 Years',
      startDate: '05 Dec 2023',
      endDate: '05 Dec 2038',
      nextDue: '05 Dec 2024',
      totalPaid: '₹60,000',
      color: '#ecfdf5',
      initials: 'BA',
    },
  ];

  const [filters, setFilters] = useState({
    company: '',
    status: '',
    year: '',
    type: ''
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      company: '',
      status: '',
      year: '',
      type: ''
    });
  };

  // ✅ Filtering logic fixed
  const filteredPolicies = policies.filter(p => {
    return (!filters.company || p.company === filters.company) &&
      (!filters.status || p.status === filters.status) &&
      (!filters.year || p.startDate.includes(filters.year)) &&
      (!filters.type || p.type === filters.type);
  });

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="main-content">
        <div className="my-policies">
          <div className="d-flex justify-content-between align-items-start flex-wrap">
            <div className="text-section">
              <h2 className='fw-bold h_Dark'>My Policies</h2>
              <p>Manage and track all your insurance policies in one place</p>
            </div>
          </div>

          <div className="section">
            {/* ✅ Filter Section */}
            <div className="filter-bar">
              <div className="filter-title">
                <i className="fas fa-filter"></i>
                <span>Filters</span>
              </div>

              <select className="filter-select" onChange={(e) => handleFilterChange('company', e.target.value)}>
                <option value="">Company</option>
                <option>HDFC Life</option>
                <option>ICICI Prudential</option>
                <option>LIC India</option>
                <option>Bajaj Allianz</option>
              </select>

              <select className="filter-select" onChange={(e) => handleFilterChange('status', e.target.value)}>
                <option value="">Status</option>
                <option>Active</option>
                <option>Lapsed</option>
                <option>Renewed</option>
              </select>

              <select className="filter-select" onChange={(e) => handleFilterChange('year', e.target.value)}>
                <option value="">Select Year</option>
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return <option key={year} value={year}>{year}</option>
                })}
              </select>

              <select className="filter-select" onChange={(e) => handleFilterChange('type', e.target.value)}>
                <option value="">Insurance Type</option>
                <option>Health</option>
                <option>Life</option>
                <option>Term</option>
                <option>Vehicle</option>
              </select>

              <button className="clear-btn" onClick={clearFilters}>Clear All</button>
            </div>

            {/* ✅ Grid-based cards section */}
            <div className={`policies-container ${view}`}>
              {filteredPolicies.length === 0 ? (
                <p className="text-muted">No policies found matching your filters.</p>
              ) : (
                filteredPolicies.map((p, i) => (
                  <div className="policy-card" key={i}>
                    <div className="card-top">
                      <div className="initial-badge">{p.initials}</div>
                      <div className="info">
                        <strong className="company">{p.company}</strong>
                        <p className="scheme">{p.scheme}</p>
                      </div>
                      <span className={`status ${p.status.toLowerCase()}`}>{p.status}</span>
                    </div>

                    <div className="card-body">
                      <p><strong>Policy Term:</strong> {p.term}</p>
                      <p><strong>Policy Period:</strong> {p.startDate} – {p.endDate}</p>
                      <p><strong>Next Due Date:</strong> {p.nextDue}</p>
                      <p><strong>Total Premium Paid:</strong> {p.totalPaid}</p>
                    </div>

                    <div className="card-bottom">
                      <div className="amount-label">Premium</div>
                      <div className="amount">{p.amount}</div>
                    </div>

                    <div className="card-actions">
                      <button className="btn-outline" onClick={() => navigate('/customer/policy-view')}>View Details</button>
                      <button className="btn-filled">Pay Now</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPoliciesPage;
