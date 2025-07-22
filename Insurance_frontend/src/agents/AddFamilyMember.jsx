import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaSearch,
  FaEye,
  FaPlus,
  FaSync,
  FaTrashAlt,
  FaArrowLeft,
  FaUserPlus,
  FaUndo,
  FaSave,
} from "react-icons/fa";

const AddFamilyMember = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("member");
  const [groupId, setGroupId] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [searchCustomer, setSearchCustomer] = useState({ name: "", policyNumber: "" });

  const [form, setForm] = useState({
    policyNumber: "",
    primaryHolder: "",
    memberName: "",
    relation: "",
    dob: "",
    age: "",
    occupation: "",
    nomineeName: "",
    nomineeRelation: "",
    
  });

  const [policyForm, setPolicyForm] = useState({
    policyNumber: "",
    policyHolderName: "",
    contact: "",
    email: "",
    company: "",
    category: "",
    type: "",
    premium: "",
    paymentMode: "",
    startDate: "",
    maturityDate: "",
    branch: "",
  });

  const [familyList, setFamilyList] = useState([]);

  

  const handleMemberChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePolicyChange = (e) => {
    setPolicyForm({ ...policyForm, [e.target.name]: e.target.value });
  };

  const handleSearchCustomer = async () => {
    if (searchCustomer.name && searchCustomer.policyNumber) {
      try {
        const res = await fetch("http://localhost:5000/api/family/checkOrCreate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agentId: user?.id || "AGENT123", // fallback
            primaryHolder: searchCustomer.name,
            policyNumber: searchCustomer.policyNumber,
          }),
        });

        const data = await res.json();
        console.log("Group API Response:", data);

        if (res.ok) {
          if (!data.groupId) {
            alert("Group ID missing in response");
            return;
          }
          setGroupId(data.groupId);
          setFormSubmitted(true);
          setForm((prev) => ({
            ...prev,
            primaryHolder: searchCustomer.name,
            policyNumber: searchCustomer.policyNumber,
          }));
        } else {
          alert("❌ " + (data.msg || "Failed to fetch or create group"));
        }
      } catch (err) {
        console.error("Search error:", err);
        alert("Server error");
      }
    } else {
      alert("Please fill in both fields.");
    }
  };

  const handleAddMember = async () => {
    if (!form.memberName || !form.relation || !form.age) {
      alert("Please fill all required fields.");
      return;
    }
    console.log("🚫 groupId missing:", groupId);
    if (!groupId) {
      alert("Please search for a customer first.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/family/add/${groupId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.memberName,
          relation: form.relation,
          dob: form.dob,
          age: parseInt(form.age),
          occupation: form.occupation,
          nomineeName: form.nomineeName,
          nomineeRelation: form.nomineeRelation,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setFamilyList([...familyList, {
          name: form.memberName,
          relation: form.relation,
          age: form.age,
          status: "Active",
        }]);

        setForm((prevForm) => ({
          ...prevForm,
          name: "",
          relation: "",
          age: "",
          dob: "",
          occupation: "",
          nomineeName: "",
          nomineeRelation: "",
          
        }));
      } else {
        alert("❌ Failed to add member");
      }
    } catch (err) {
      console.error("Add member error:", err);
      alert("Server error");
    }
  };

  const handleDelete = (index) => {
    const updated = [...familyList];
    updated.splice(index, 1);
    setFamilyList(updated);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ backgroundColor: '#fff', padding: '20px', borderBottom: '1px solid #e0e0e0', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={() => navigate("/agent/dashboard")} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#007bff' }}>
              <FaArrowLeft />
            </button>
            <div>
              <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>Add Family Member</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Add family members to existing policy and manage their policies</p>
            </div>
          </div>
          <button style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' }}>
            <FaEye style={{ marginRight: '5px' }} /> View Existing Policy
          </button>
        </div>
      </div>

      {/* Customer Search Section - Hide after form submitted */}
      {!formSubmitted && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
          <h3 style={{ color: '#1d4ed8', marginBottom: '20px' }}>Search Customer</h3>
          <div style={{ display: 'flex', gap: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 'bold' }}>Customer Name *</label>
              <input
                type="text"
                placeholder="Enter customer name (e.g., Rajesh Kumar)"
                value={searchCustomer.name}
                onChange={(e) => setSearchCustomer({ ...searchCustomer, name: e.target.value })}
                style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '5px' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 'bold' }}>Policy Number *</label>
              <input
                type="text"
                placeholder="Enter policy number (e.g., LIC12345678)"
                value={searchCustomer.policyNumber}
                onChange={(e) => setSearchCustomer({ ...searchCustomer, policyNumber: e.target.value })}
                style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '5px' }}
              />
            </div>
            <div style={{ alignSelf: 'flex-end' }}>
              <button
                onClick={handleSearchCustomer}
                style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <FaSearch /> Search
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rest of the Page - Form & Existing Family Table */}
      {formSubmitted && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          {/* Left Section */}
        <div style={{ flex: '1' }}>
          <div style={{ 
            backgroundColor: '#fff', 
            padding: '20px', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {/* GroupID Display */}
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '15px', 
              borderRadius: '5px',
              marginBottom: '20px',
              border: '1px solid #e9ecef'
            }}>
              <label style={{ fontWeight: 'bold', color: '#495057', fontSize: '14px' }}>Group ID:</label>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: 'bold', 
                color: '#007bff',
                marginTop: '5px'
              }}>
                {groupId}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ 
              display: 'flex', 
              marginBottom: '20px',
              borderBottom: '2px solid #f0f0f0'
            }}>
              <button
                style={{ 
                  padding: '12px 24px', 
                  border: 'none', 
                  backgroundColor: activeTab === "member" ? '#f3f4f6' : 'transparent',
                  color: activeTab === "member" ? '#6b7280' : '#666',
                  cursor: 'pointer',
                  borderRadius: '5px 5px 0 0',
                  fontWeight: 'bold'
                }}
                onClick={() => setActiveTab("member")}
              >
                Member Details
              </button>
              <button
                style={{ 
                  padding: '12px 24px', 
                  border: 'none', 
                  backgroundColor: activeTab === "policy" ? '#f3f4f6' : 'transparent',
                  color: activeTab === "policy" ? '#6b7280' : '#666',
                  cursor: 'pointer',
                  borderRadius: '5px 5px 0 0',
                  fontWeight: 'bold'
                }}
                onClick={() => setActiveTab("policy")}
              >
                Add New Policy
              </button>
            </div>

            {/* Member Form */}
            {activeTab === "member" && (
              <>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                  gap: '15px',
                  marginBottom: '20px'
                }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                      Policy Number *
                    </label>
                    <input 
                      type="text" 
                      name="policyNumber" 
                      placeholder="Enter policy number" 
                      value={form.policyNumber} 
                      onChange={handleMemberChange}
                      style={{ 
                        width: '100%', 
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                      Primary Holder Name *
                    </label>
                    <input 
                      type="text" 
                      name="primaryHolder" 
                      placeholder="Enter primary holder name" 
                      value={form.primaryHolder} 
                      onChange={handleMemberChange}
                      style={{ 
                        width: '100%', 
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                      Member Name *
                    </label>
                    <input 
                      type="text" 
                      name="memberName" 
                      placeholder="Enter member name" 
                      value={form.memberName} 
                      onChange={handleMemberChange}
                      style={{ 
                        width: '100%', 
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                      Relation *
                    </label>
                    <select 
                      name="relation" 
                      value={form.relation} 
                      onChange={handleMemberChange}
                      style={{ 
                        width: '100%', 
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">Select relation</option>
                      <option>Wife</option>
                      <option>Son</option>
                      <option>Daughter</option>
                      <option>Mother</option>
                      <option>Father</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                      Date of Birth
                    </label>
                    <input 
                      type="date" 
                      name="dob" 
                      value={form.dob} 
                      onChange={handleMemberChange}
                      style={{ 
                        width: '100%', 
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                      Age *
                    </label>
                    <input 
                      type="text" 
                      name="age" 
                      placeholder="Enter age" 
                      value={form.age} 
                      onChange={handleMemberChange}
                      style={{ 
                        width: '100%', 
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                      Occupation
                    </label>
                    <input 
                      type="text" 
                      name="occupation" 
                      placeholder="Enter occupation" 
                      value={form.occupation} 
                      onChange={handleMemberChange}
                      style={{ 
                        width: '100%', 
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                      Nominee Name
                    </label>
                    <input 
                      type="text" 
                      name="nomineeName" 
                      placeholder="Enter nominee name" 
                      value={form.nomineeName} 
                      onChange={handleMemberChange}
                      style={{ 
                        width: '100%', 
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                      Nominee Relation
                    </label>
                    <input 
                      type="text" 
                      name="nomineeRelation" 
                      placeholder="Enter nominee relation" 
                      value={form.nomineeRelation} 
                      onChange={handleMemberChange}
                      style={{ 
                        width: '100%', 
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>
                <div className="actions">
                  <button className="btn-primary blue__btn" onClick={handleAddMember}><i className="bi bi-save me-1"></i> Add Member</button>
                  <button className="btn-reset Reset__btn" onClick={() => setForm({
                    policyNumber: "", primaryHolder: "", memberName: "", relation: "", dob: "", age: "", occupation: "", nomineeName: "", nomineeRelation: ""
                  })}><i className="bi bi-arrow-clockwise me-1"></i> Reset Form</button>
                </div>
              </>
            )}

            {/* Add Policy Form */}
            {activeTab === "policy" && (
              <>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                  gap: '15px',
                  marginBottom: '20px'
                }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                      Policy Number *
                    </label>
                    <input 
                      type="text" 
                      name="policyNumber" 
                      placeholder="Enter policy number" 
                      value={policyForm.policyNumber} 
                      onChange={handlePolicyChange}
                      style={{ 
                        width: '100%', 
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                      Policy Holder Name *
                    </label>
                    <input 
                      type="text" 
                      name="policyHolderName" 
                      placeholder="Enter policy holder name" 
                      value={policyForm.policyHolderName} 
                      onChange={handlePolicyChange}
                      style={{ 
                        width: '100%', 
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                      Contact Number *
                    </label>
                    <input 
                      type="text" 
                      name="contact" 
                      placeholder="Enter contact number" 
                      value={policyForm.contact} 
                      onChange={handlePolicyChange}
                      style={{ 
                        width: '100%', 
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="Enter email address" 
                      value={policyForm.email} 
                      onChange={handlePolicyChange}
                      style={{ 
                        width: '100%', 
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                      Insurance Company *
                    </label>
                    <select 
                      name="company" 
                      value={policyForm.company} 
                      onChange={handlePolicyChange}
                      style={{ 
                        width: '100%', 
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">Select insurance company</option>
                      <option>LIC</option>
                      <option>HDFC Life</option>
                      <option>ICICI Prudential</option>
                      <option>SBI Life</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                      Insurance Category *
                    </label>
                    <select 
                      name="category" 
                      value={policyForm.category} 
                      onChange={handlePolicyChange}
                      style={{ 
                        width: '100%', 
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">Select insurance category</option>
                      <option>Life Insurance</option>
                      <option>General Insurance</option>
                      <option>Health Insurance</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                      Insurance Type *
                    </label>
                    <select 
                      name="type" 
                      value={policyForm.type} 
                      onChange={handlePolicyChange}
                      style={{ 
                        width: '100%', 
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">Select insurance type</option>
                      <option>Term</option>
                      <option>Endowment</option>
                      <option>ULIP</option>
                      <option>Whole Life</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                      Premium Amount *
                    </label>
                    <input 
                      type="text" 
                      name="premium" 
                      placeholder="Enter premium amount" 
                      value={policyForm.premium} 
                      onChange={handlePolicyChange}
                      style={{ 
                        width: '100%', 
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                      Payment Mode *
                    </label>
                    <select 
                      name="paymentMode" 
                      value={policyForm.paymentMode} 
                      onChange={handlePolicyChange}
                      style={{ 
                        width: '100%', 
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">Select payment mode</option>
                      <option>Monthly</option>
                      <option>Quarterly</option>
                      <option>Half-yearly</option>
                      <option>Yearly</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                      Policy Start Date *
                    </label>
                    <input 
                      type="date" 
                      name="startDate" 
                      value={policyForm.startDate} 
                      onChange={handlePolicyChange}
                      style={{ 
                        width: '100%', 
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                      Maturity Date *
                    </label>
                    <input 
                      type="date" 
                      name="maturityDate" 
                      value={policyForm.maturityDate} 
                      onChange={handlePolicyChange}
                      style={{ 
                        width: '100%', 
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                      Branch Name
                    </label>
                    <input 
                      type="text" 
                      name="branch" 
                      placeholder="Enter branch name" 
                      value={policyForm.branch} 
                      onChange={handlePolicyChange}
                      style={{ 
                        width: '100%', 
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>
                <div className="actions">
                  <button className="btn-success blue__btn"><i className="bi bi-save me-1"></i> Save Policy</button>
                  <button className="btn-reset Reset__btn" onClick={() => setPolicyForm({
                    policyNumber: "", contact: "", email: "", company: "", category: "", type: "", premium: "", paymentMode: "", startDate: "", maturityDate: "", branch: ""
                  })}><i className="bi bi-arrow-clockwise me-1"></i> Reset Form</button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div style={{ flex: '1' }}>
          <div style={{ 
            backgroundColor: '#fff', 
            padding: '20px', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h5 style={{ marginBottom: '15px', color: '#333' }}>Existing Family Members</h5>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Name</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Relation</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Age</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {familyList.map((member, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '12px' }}>{member.name}</td>
                      <td style={{ padding: '12px' }}>{member.relation}</td>
                      <td style={{ padding: '12px' }}>{member.age}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          backgroundColor: '#28a745', 
                          color: 'white', 
                          padding: '4px 8px', 
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}>
                          {member.status}
                        </span>
                      </td>
                     <td><button className="btn-delete trash__btn" onClick={() => handleDelete(i)}><i className="bi bi-trash"></i></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default AddFamilyMember;
