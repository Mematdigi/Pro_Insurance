import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { FaSearch, FaFilter, FaChevronDown } from 'react-icons/fa';

const policiesData = [
  {
    name: 'Family Health Plus',
    number: 'HP-2024-156',
    type: 'Health',
    due: 'Jan 25, 2024',
    amount: '₹18,000',
    status: 'Paid',
  },
  {
    name: 'Home Protection Plan',
    number: 'HM-2024-123',
    type: 'Home',
    due: 'Jan 30, 2024',
    amount: '₹22,000',
    status: 'Overdue',
  },
  {
    name: 'Comprehensive Health Plan',
    number: 'HP-2024-001',
    type: 'Health',
    due: 'Feb 15, 2024',
    amount: '₹15,000',
    status: 'Overdue',
  },
  {
    name: 'Vehicle Insurance Premium',
    number: 'VI-2024-045',
    type: 'Motor',
    due: 'Feb 20, 2024',
    amount: '₹8,500',
    status: 'Pending',
  },
  {
    name: 'Term Life Insurance',
    number: 'LI-2024-078',
    type: 'Life',
    due: 'Feb 25, 2024',
    amount: '₹12,000',
    status: 'Pending',
  },
];

const PolicyDuePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const policyTypes = ['All', ...new Set(policiesData.map(p => p.type))];

  const filteredPolicies = policiesData.filter(policy => {
    const matchesSearch =
      policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.number.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'All' || policy.type === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="policy-due-layout dashboard-layout d-flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="main-content p-4">
        <h2 className="page-title h_Dark">Policy Due Overview</h2>
        <p className="page-subtitle">Manage your insurance policies and track payment due dates</p>

        <div className="alert-box">
          <span>❗ You have <strong>2 overdue policies</strong>. Please pay to avoid penalty.</span>
        </div>

        {/* Search & Filters */}
        <div className="filters-box d-flex flex-wrap align-items-center gap-3 my-3">
          <div className="search-bar flex-grow-1">
            <FaSearch />
            <input
              type="text"
              placeholder="Search by policy name or number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="date-filter d-flex align-items-center">
            <FaFilter className="me-2" />
            <input type="date" />
          </div>
          <div className="type-dropdown">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="form-select"
            >
              {policyTypes.map((type, i) => (
                <option key={i} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="policy-table table-responsive mt-3">
          <table className="table custom-bordered-table">
            <thead>
              <tr>
                <th>Policy Name ⬍</th>
                <th>Policy Number ⬍</th>
                <th>Insurance Type ⬍</th>
                <th>Due Date ⬍</th>
                <th>Premium Amount ⬍</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPolicies.map((policy, idx) => (
                <tr key={idx}>
                  <td>{policy.name}</td>
                  <td>{policy.number}</td>
                  <td>{policy.type}</td>
                  <td>{policy.due}</td>
                  <td><strong>{policy.amount}</strong></td>
                  <td>
                    <span className={`status-badge ${policy.status.toLowerCase()}`}>
                      {policy.status}
                    </span>
                  </td>
                  <td>
                    {(policy.status === 'Pending' || policy.status === 'Overdue') && (
                      <button className="btn btn-pay">
                        {policy.status === 'Overdue' ? 'Pay Overdue' : 'Pay Now'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-muted">Showing {filteredPolicies.length} of {policiesData.length} policies</p>

          {/* Pagination Placeholder */}
          <div className="pagination-box d-flex justify-content-between align-items-center mt-3">
            <div></div>
            <div className="d-flex gap-3 align-items-center">
              <span className="text-muted">Page 1 of 1</span>
              <button className="btn btn-outline-light">Previous</button>
              <button className="btn btn-outline-light">Next</button>
            </div>
          </div>
        </div>

        <div className="support-box d-flex justify-content-end mt-4">
          <button className="btn btn-help">💬 Need Help Paying?</button>
        </div>
      </div>
    </div>
  );
};

export default PolicyDuePage;
