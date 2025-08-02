import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaSearch, FaEye, FaArrowLeft } from "react-icons/fa";

const AddFamilyMember = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("member");
  const [groupId, setGroupId] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [searchCustomer, setSearchCustomer] = useState({ name: "", policyNumber: "" });
  const [memberQuery, setMemberQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showPolicyForm, setShowPolicyForm] = useState(false);
  const [isPolicyFetched, setIsPolicyFetched] = useState(false);

  const [form, setForm] = useState({
    policyNumber: "",
    primaryHolder: "",
    memberName: "",
    relation: "",
    dob: "",
    age: "",
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

  // ✅ Check if member form is fully filled
  const isMemberFormValid =
    form.policyNumber && form.primaryHolder && form.memberName && form.relation && form.dob && form.age;

  const handlePolicyChange = (e) => {
    setPolicyForm({ ...policyForm, [e.target.name]: e.target.value });
  };

  const handleSearchCustomer = async () => {
    try {
      const policyNumber = searchCustomer.policyNumber.trim();
      const customerName = searchCustomer.name.trim();
      if (!policyNumber || !customerName) {
        alert("Please enter both policy number and customer name.");
        return;
      }
      const res = await fetch(`http://localhost:5000/api/family/check-policy/${policyNumber}`);
      const data = await res.json();

      if (!data.exists) {
        alert("Policy not found. Please check the policy number.");
        return;
      }
      const primaryHolderName = data.policy?.customerName || searchCustomer.name;
      const primaryPolicyNumber = data.policy?.policyNumber || searchCustomer.policyNumber;

      if (primaryHolderName && primaryPolicyNumber) {
        const createRes = await fetch("http://localhost:5000/api/family/checkOrCreate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            
            agentId: user?.id,
            primaryHolder: primaryHolderName,
            policyNumber: primaryPolicyNumber,
          }),
        });

        const createData = await createRes.json();
        if (createRes.ok) {
          setGroupId(createData.groupId);
          setFormSubmitted(true);

          const memberRes = await fetch(`http://localhost:5000/api/family/group/${createData.groupId}`);
          const memberData = await memberRes.json();

          if (memberRes.ok) {
            setFamilyList(memberData.familyMembers || []);
          }
          setForm((prev) => ({
            ...prev,
            primaryHolder: primaryHolderName,
            policyNumber: primaryPolicyNumber,
          }));
        } else {
          alert("❌ " + (createData.msg || "Failed to fetch or create group"));
        }
      } else {
        alert("Please provide valid primary holder name and policy number.");
      }
    } catch (error) {
      console.error("Error searching customer:", error);
      alert("❌ Failed to search customer. Please try again.");
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (memberQuery.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`http://localhost:5000/api/family/search-member/${memberQuery}`);
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Error fetching suggestions", err);
      }
    };
    fetchSuggestions();
  }, [memberQuery]);

  const handleMemberChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
    if (name === "memberName") {
      setMemberQuery(value);
    }
  };

  const handleAddMember = () => {
    if (!isMemberFormValid) {
      alert("Please fill all required fields.");
      return;
    }
    alert("✅ Member details filled. Now click 'Add Policy' to continue.");
  };

  const handleSavePolicy = async () => {
    if (!form.memberName || !form.relation || !form.age) {
      alert("Please fill Member Name, Relation, and Age before saving.");
      return;
  }

  if (!policyForm.policyNumber || !policyForm.policyHolderName || !policyForm.contact || !policyForm.company || !policyForm.category || !policyForm.type || !policyForm.premium || !policyForm.startDate || !policyForm.maturityDate) {
    alert("Please fill all required policy fields.");
    return;
  }

  try {
    // 1️⃣ Save Member in FamilyGroup
    const memberPayload = {
      agentId: user?.id,
      name: form.memberName,
      relation: form.relation,
      age: form.age,
      dob: form.dob || ""
    };

    const memberRes = await fetch(`http://localhost:5000/api/family/add/${groupId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(memberPayload),
    });

    const memberData = await memberRes.json();
    if (!memberRes.ok) {
      alert(memberData.msg || "Failed to save member.");
      return;
    }

    // 2️⃣ Check if Policy already exists
    const checkRes = await fetch(`http://localhost:5000/api/check/${policyForm.policyNumber}`);
    const checkData = await checkRes.json();

    if (checkRes.ok && checkData.exists) {
      // ✅ Policy exists: Add member successfully without policy save
      alert("✅ Member added successfully!");

      // 🔄 Fetch updated family members dynamically
      const updatedMembers = await fetch(`http://localhost:5000/api/family/group/${groupId}`);
      const updatedData = await updatedMembers.json();
      if (updatedMembers.ok) {
        setFamilyList(updatedData.familyMembers || []);
      }
      return;
    }

    // 3️⃣ Policy does not exist → Save new policy
    const policyPayload = {
      policyNumber: policyForm.policyNumber,
      customerName: policyForm.policyHolderName,
      customerPhone: policyForm.contact,
      customerEmail: policyForm.email || "",
      company: policyForm.company,
      insuranceType: policyForm.category,
      policyType: policyForm.type,
      agentId: user?.id,
      policyDetails: {
        premium: Number(policyForm.premium),
        paymentMode: policyForm.paymentMode,
        startDate: policyForm.startDate,
        endDate: policyForm.maturityDate,
        branch: policyForm.branch,
      }
    };

    const policyRes = await fetch("http://localhost:5000/api/policies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(policyPayload),
    });

    const policyData = await policyRes.json();
    if (!policyRes.ok) {
      alert(policyData.msg || "Failed to save policy.");
      return;
    }

    alert("✅ Member and Policy saved successfully!");

    // 🔄 Refresh members table
    const updatedMembers = await fetch(`http://localhost:5000/api/family/group/${groupId}`);
    const updatedData = await updatedMembers.json();
    if (updatedMembers.ok) {
      setFamilyList(updatedData.familyMembers || []);
    }

  } catch (error) {
    console.error("❌ Error saving policy:", error);
    alert("Unexpected error occurred while saving policy.");
  }
};

const handleDelete = (index) => {
    const updated = [...familyList];
    updated.splice(index, 1);
    setFamilyList(updated);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#fff', padding: '20px', borderBottom: '1px solid #e0e0e0', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={() => navigate("/agent/dashboard")} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#007bff' }}>
              <FaArrowLeft />
            </button>
            <div>
              <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>Add Family Member</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                Add family members to existing policy and manage their policies
              </p>
            </div>
          </div>
          <button style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' }}>
            <FaEye style={{ marginRight: '5px' }} /> View Existing Policy
          </button>
        </div>
      </div>

      {/* Search Section */}
      {!formSubmitted && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
          <h3 style={{ color: '#1d4ed8', marginBottom: '20px' }}>Search Customer</h3>
          <div style={{ display: 'flex', gap: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 'bold' }}>Customer Name *</label>
              <input type="text" placeholder="Enter customer name" value={searchCustomer.name} onChange={(e) => setSearchCustomer({ ...searchCustomer, name: e.target.value })}
                style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '5px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 'bold' }}>Policy Number *</label>
              <input type="text" placeholder="Enter policy number (e.g., LIC12345678)" value={searchCustomer.policyNumber}
                onChange={(e) => setSearchCustomer({ ...searchCustomer, policyNumber: e.target.value })}
                style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '5px' }} />
            </div>
            <div style={{ alignSelf: 'flex-end' }}>
              <button onClick={handleSearchCustomer} style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <FaSearch /> Search
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {formSubmitted && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          {/* Left Section */}
          <div style={{ flex: '1' }}>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              {/* Group ID */}
              <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '5px', marginBottom: '20px', border: '1px solid #e9ecef' }}>
                <label style={{ fontWeight: 'bold', color: '#495057', fontSize: '14px' }}>Group ID:</label>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#007bff', marginTop: '5px' }}>{groupId}</div>
              </div>

              {/* ✅ Member Form */}
              {activeTab === "member" && (
                <>
                  <div
                   style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                    <input type="text" name="policyNumber" placeholder="Enter policy number" value={form.policyNumber} onChange={handleMemberChange} />
                    <input type="text" name="primaryHolder" placeholder="Enter primary holder name" value={form.primaryHolder} onChange={handleMemberChange} />
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                          Member Name *
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            name="memberName"
                            placeholder="Enter member name"
                            value={form.memberName}
                            onChange={(e) => {
                              handleMemberChange(e);
                              setMemberQuery(e.target.value);
                            }}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                          />
                          {suggestions.length > 0 && (
                            <ul style={{
                              listStyle: "none", margin: 0, padding: "5px", border: "1px solid #ccc",
                              borderRadius: "4px", background: "white", position: "absolute", zIndex: 1000, width: "100%"
                            }}>
                              {suggestions.map((sug) => (
                                <li
                                  key={sug._id}
                                  style={{ padding: "8px", cursor: "pointer", borderBottom: "1px solid #ddd" }}
                                  onClick={async () => {
                                    setForm({ ...form, memberName: sug.name });
                                    setSuggestions([]);


                                    try{
                                      const res = await fetch(`http://localhost:5000/api/by-id/${sug._id}`);
                                      const data = await res.json();
                                      if (res.ok && data) {
                                        setPolicyForm({
                                          policyNumber: data.policyNumber || "",
                                          policyHolderName: data.customerName|| sug.name,
                                          contact: data.customerPhone || "",
                                          email: data.customerEmail || "",
                                          company: data.company || "",
                                          category: data.insuranceType || "",
                                          type: data.policyType || "",
                                          premium: data.policyDetails?.premium || "",
                                          paymentMode: "",
                                          startDate: data.policyDetails?.startDate || "",
                                          maturityDate: data.policyDetails.endDate || "",
                                          branch: ""
                                        });
                                        setIsPolicyFetched(true);
                                      } else {
                                        setPolicyForm((prev) => ({
                                          ...prev,
                                          policyHolderName: sug.name,
                                          contact: sug.contact ||"",
                                      }))
                                    }
                                  } catch (err) {
                                    console.error("Error fetching policy data:", err);
                                  }
                                }}
                                >
                                  {sug.name} - ({sug.contact || "No Contact"})
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    <select name="relation" value={form.relation} onChange={handleMemberChange}>
                      <option value="">Select relation</option><option>Wife</option><option>Son</option><option>Daughter</option><option>Mother</option><option>Father</option>
                    </select>
                    <input type="date" name="dob" value={form.dob} onChange={handleMemberChange} />
                    <input type="text" name="age" placeholder="Enter age" value={form.age} onChange={handleMemberChange} />
                  </div>

                  {/* Actions */}
                  <div className="actions" style={{ marginTop: '15px' }}>
                    <button className="btn-primary blue__btn" onClick={handleAddMember}><i className="bi bi-save me-1"></i> Add Member</button>
                    <button className="btn-reset Reset__btn" onClick={() => setForm({ policyNumber: "", primaryHolder: "", memberName: "", relation: "", dob: "", age: "" })}>
                      <i className="bi bi-arrow-clockwise me-1"></i> Reset Form
                    </button>
                    {isMemberFormValid && !showPolicyForm && (
                      <button className="btn-primary blue__btn" style={{ marginTop: '10px' }} onClick={() => setShowPolicyForm(true)}>
                        + Add Policy
                      </button>
                    )}
                  </div>

                  {/* ✅ Policy Form */}
                  {showPolicyForm && (
                    <div className="policy-form" style={{ marginTop: '20px' }}>
                      <h4>Add Policy Details</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                        <input type="text" name="policyNumber" placeholder="Enter policy number" value={policyForm.policyNumber} onChange={handlePolicyChange} />
                        <input type="text" name="policyHolderName" placeholder="Enter policy holder name" value={policyForm.policyHolderName} onChange={handlePolicyChange} />
                        <input type="text" name="contact" placeholder="Enter contact number" value={policyForm.contact} onChange={handlePolicyChange} />
                        <input type="email" name="email" placeholder="Enter email address" value={policyForm.email} onChange={handlePolicyChange} />
                        {isPolicyFetched ? (
                          <select name="company" defaultValue={policyForm.company} disabled>
                            <option value={policyForm.company}>{policyForm.company || "Fetching..."}</option>
                          </select>
                        ) : (
                          <select name="company" value={policyForm.company} onChange={handlePolicyChange}>
                            <option value="">Select insurance company</option>
                            <option value="LIC">LIC</option>
                            <option value="HDFC Life">HDFC Life</option>
                            <option value="SBI Life">SBI Life</option>
                            <option value="Tata AIA">Tata AIA</option>
                          </select>
                        )}

                        {/* Category Dropdown */}
                        {isPolicyFetched ? (
                          <select name="category" defaultValue={policyForm.category} disabled>
                            <option value={policyForm.category}>{policyForm.category || "Fetching..."}</option>
                          </select>
                        ) : (
                          <select name="category" value={policyForm.category} onChange={handlePolicyChange}>
                            <option value="">Select insurance category</option>
                            <option value="Life Insurance">Life Insurance</option>
                            <option value="General Insurance">General Insurance</option>
                          </select>
                        )}

                        {/* Type Dropdown */}
                        {isPolicyFetched ? (
                          <select name="type" defaultValue={policyForm.type} disabled>
                            <option value={policyForm.type}>{policyForm.type || "Fetching..."}</option>
                          </select>
                        ) : (
                          <select name="type" value={policyForm.type} onChange={handlePolicyChange}>
                            <option value="">Select insurance type</option>
                            <option value="Term">Term</option>
                            <option value="ULIP">ULIP</option>
                            <option value="Endowment">Endowment</option>
                          </select>
                        )}



                        
                        <input type="text" name="premium" placeholder="Enter premium amount" value={policyForm.premium} onChange={handlePolicyChange} />
                        <select name="paymentMode" value={policyForm.paymentMode} onChange={handlePolicyChange}>
                          <option value="">Select payment mode</option>
                          <option>Monthly</option>
                          <option>Yearly</option>
                        </select>
                        <input type="date" name="startDate" value={policyForm.startDate} onChange={handlePolicyChange} />
                        <input type="date" name="maturityDate" value={policyForm.maturityDate} onChange={handlePolicyChange} />
                        <input type="text" name="branch" placeholder="Enter branch name" value={policyForm.branch} onChange={handlePolicyChange} />
                      </div>
                      <button className="btn-success blue__btn" style={{ marginTop: '10px' }} onClick={handleSavePolicy}>Save Member & Policy</button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right Section: Existing Members */}
          <div style={{ flex: '1' }}>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h5 style={{ marginBottom: '15px', color: '#333' }}>Existing Family Members</h5>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                      <th>Name</th><th>Relation</th><th>Age</th><th>Status</th><th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {familyList.map((member, i) => (
                      <tr key={i}>
                        <td>{member.name}</td>
                        <td>{member.relation}</td>
                        <td>{member.age}</td>
                        <td><span style={{ backgroundColor: '#28a745', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }}>{member.status}</span></td>
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