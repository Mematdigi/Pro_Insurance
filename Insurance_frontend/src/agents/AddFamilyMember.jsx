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
  const [showSuggestions, setShowSuggestions] = useState(false); // ✅ Control suggestions visibility
  const [isPolicyFetched, setIsPolicyFetched] = useState(false);

  const [form, setForm] = useState({
    policyNumber: "",
    primaryHolder: "",
    memberName: "",
    relation: "",
    dob: "",
    age: "",
  });

  // ✅ Initialize policyForm with default values to prevent undefined errors
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
      if (memberQuery.length < 1) { 
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      try {
        const res = await fetch(`http://localhost:5000/api/family/search-member/${memberQuery}`);
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0); // ✅ Show suggestions if data exists
      } catch (err) {
        console.error("Error fetching suggestions", err);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };
    
    // ✅ Add debounce to avoid too many API calls
    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [memberQuery]);

  // ✅ Auto-calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return "";
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  const handleMemberChange = (e) => {
    const { name, value } = e.target;
    
    // ✅ Auto-calculate age when DOB changes
    if (name === "dob") {
      const calculatedAge = calculateAge(value);
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value,
        age: calculatedAge, // Auto-fill age
      }));
      
      // ✅ Auto-shift to age field after DOB selection
      setTimeout(() => {
        const ageField = document.querySelector('input[name="age"]');
        if (ageField) ageField.focus();
      }, 100);
      
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value,
      }));
    }
    
    if (name === "memberName") {
      setMemberQuery(value);
      setShowSuggestions(value.length > 0); // ✅ Show suggestions when typing
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
  
      // ✅ Update family list immediately after saving member
      const updatedMemberRes = await fetch(`http://localhost:5000/api/family/group/${groupId}`);
      const updatedMemberData = await updatedMemberRes.json();
      if (updatedMemberRes.ok) {
        setFamilyList(updatedMemberData.familyMembers || []);
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

  // ✅ Reset function to clear all forms
  const handleResetForms = () => {
    setForm((prev) => ({
      ...prev,
      memberName: "",
      relation: "",
      dob: "",
      age: "",
    }));
    setPolicyForm({
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
    setShowPolicyForm(false);
    setMemberQuery("");
    setSuggestions([]);
    setShowSuggestions(false); // ✅ Hide suggestions
  };

  // Form styles
  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none'
  };

  const suggestionListStyle = {
    listStyle: 'none',
    margin: 0,
    padding: '5px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    background: 'white',
    position: 'absolute',
    zIndex: 1000,
    width: '100%',
    maxHeight: '150px',
    overflowY: 'auto'
  };

  const suggestionItemStyle = {
    padding: '8px',
    cursor: 'pointer',
    borderBottom: '1px solid #ddd'
  };

  const addPolicyButtonStyle = {
    marginTop: '15px',
    backgroundColor: '#1e40af',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer'
  };

  const saveButtonStyle = {
    marginTop: '15px',
    backgroundColor: '#16a34a',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer'
  };

  // ✅ Added missing resetButtonStyle
  const resetButtonStyle = {
    marginTop: '15px',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer'
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
                  {/* Member Form Grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                      gap: "15px",
                      marginBottom: "20px",
                    }}
                  >
                    {/* Policy Number */}
                    <div>
                      <label>Policy Number</label>
                      <input
                        type="text"
                        name="policyNumber"
                        placeholder="Enter Policy Number"
                        value={form.policyNumber || ""}
                        onChange={handleMemberChange}
                        style={inputStyle}
                        readOnly
                      />
                    </div>

                    {/* Primary Holder */}
                    <div>
                      <label>Primary Holder Name</label>
                      <input
                        type="text"
                        name="primaryHolder"
                        placeholder="Enter Primary Holder Name"
                        value={form.primaryHolder || ""}
                        onChange={handleMemberChange}
                        style={inputStyle}
                        readOnly
                      />
                    </div>

                    {/* Member Name with Dropdown and Suggestions */}
                    <div style={{ position: "relative" }}>
                      <label>Member Name *</label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="text"
                          name="memberName"
                          placeholder="Enter Member Name"
                          value={form.memberName || ""}
                          onChange={(e) => {
                            handleMemberChange(e);
                            setMemberQuery(e.target.value);
                          }}
                          onFocus={() => {
                            if (memberQuery.length > 0) {
                              setShowSuggestions(true);
                            }
                          }}
                          onBlur={() => {
                            // ✅ Delay hiding suggestions to allow clicks
                            setTimeout(() => setShowSuggestions(false), 200);
                          }}
                          style={{
                            ...inputStyle,
                            paddingRight: "35px", // Space for dropdown arrow
                          }}
                        />
                        {/* ✅ Fixed Dropdown Arrow Button */}
                        <button
                          type="button"
                          onClick={async () => {
                            // ✅ Fetch all members when dropdown is clicked
                            try {
                              const res = await fetch('http://localhost:5000/api/family/search-member/all');
                              const data = await res.json();
                              setSuggestions(data);
                              setShowSuggestions(true);
                              setMemberQuery(""); // Clear query to show all
                              
                              // Focus on input
                              const memberInput = document.querySelector('input[name="memberName"]');
                              if (memberInput) memberInput.focus();
                            } catch (err) {
                              console.error("Error fetching all members:", err);
                              // Fallback: trigger with "a" query
                              setMemberQuery("a");
                              setShowSuggestions(true);
                            }
                          }}
                          style={{
                            position: "absolute",
                            right: "8px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "16px",
                            color: "#666",
                            padding: "4px",
                            width: "24px",
                            height: "24px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "3px",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#f0f0f0";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "transparent";
                          }}
                        >
                          ▼
                        </button>
                      </div>
                      
                      {/* ✅ Enhanced Suggestions Dropdown with proper visibility control */}
                      {showSuggestions && suggestions?.length > 0 && (
                        <ul
                          style={{
                            listStyle: "none",
                            margin: 0,
                            padding: "5px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            background: "white",
                            position: "absolute",
                            zIndex: 2000,
                            width: "100%",
                            maxHeight: "150px",
                            overflowY: "auto",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            top: "100%",
                            marginTop: "2px",
                          }}
                        >
                          {suggestions.map((sug) => (
                            <li
                              key={sug._id}
                              style={{
                                padding: "8px",
                                cursor: "pointer",
                                borderBottom: "1px solid #eee",
                                transition: "background-color 0.2s",
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#f8f9fa";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "white";
                              }}
                              onMouseDown={(e) => {
                                e.preventDefault(); // ✅ Prevent input blur before click
                              }}
                              onClick={async () => {
                                setForm((prev) => ({ ...prev, memberName: sug.name }));
                                setSuggestions([]);
                                setShowSuggestions(false);
                                setMemberQuery("");
                                
                                // ✅ Auto-shift to relation field
                                setTimeout(() => {
                                  const relationField = document.querySelector('select[name="relation"]');
                                  if (relationField) relationField.focus();
                                }, 100);
                                
                                try {
                                  const res = await fetch(`http://localhost:5000/api/by-id/${sug._id}`);
                                  const data = await res.json();
                                  if (res.ok && data) {
                                    setPolicyForm((prev) => ({
                                      ...prev,
                                      policyNumber: data.policyNumber || "",
                                      policyHolderName: data.customerName || sug.name,
                                      contact: data.customerPhone || "",
                                      email: data.customerEmail || "",
                                      company: data.company || "",
                                      category: data.insuranceType || "",
                                      type: data.policyType || "",
                                      premium: data.policyDetails?.premium || "",
                                      paymentMode: "",
                                      startDate: data.policyDetails?.startDate || "",
                                      maturityDate: data.policyDetails?.endDate || "",
                                    }));
                                  }
                                } catch (err) {
                                  console.error("Error fetching policy data:", err);
                                }
                              }}
                            >
                              <div style={{ fontWeight: "500" }}>{sug.name}</div>
                              <div style={{ fontSize: "12px", color: "#666" }}>
                                {sug.contact || "No Contact"}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Relation */}
                    <div>
                      <label>Relation</label>
                      <select
                        name="relation"
                        value={form.relation || ""}
                        onChange={(e) => {
                          handleMemberChange(e);
                          // ✅ Auto-shift to DOB field after relation selection
                          setTimeout(() => {
                            const dobField = document.querySelector('input[name="dob"]');
                            if (dobField) dobField.focus();
                          }, 100);
                        }}
                        style={inputStyle}
                      >
                        <option value="">Select Relation</option>
                        <option>Wife</option>
                        <option>Son</option>
                        <option>Daughter</option>
                        <option>Mother</option>
                        <option>Father</option>
                      </select>
                    </div>

                    {/* DOB with Auto Age calculation */}
                    <div>
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        name="dob"
                        value={form.dob || ""}
                        onChange={handleMemberChange} // This will auto-calculate age
                        style={inputStyle}
                      />
                    </div>

                    {/* Age - Auto calculated */}
                    <div>
                      <label>Age (Auto-calculated)</label>
                      <input
                        type="text"
                        name="age"
                        placeholder="Age will be calculated from DOB"
                        value={form.age || ""}
                        onChange={handleMemberChange}
                        style={{
                          ...inputStyle,
                          backgroundColor: form.dob ? "#f8f9fa" : "white", // Gray out if auto-calculated
                        }}
                        readOnly={!!form.dob} // Make read-only if DOB is selected
                      />
                    </div>
                  </div>

                  {/* ✅ Add Policy Button - Fixed conditional rendering */}
                  {isMemberFormValid && !showPolicyForm && (
                    <button
                      type="button"
                      style={addPolicyButtonStyle}
                      onClick={() => setShowPolicyForm(true)}
                    >
                      + Add Policy
                    </button>
                  )}

                  {/* ✅ Policy Form - Fixed conditional rendering with proper null checks */}
                  {showPolicyForm && policyForm && (
                    <div className="policy-form" style={{ marginTop: "20px" }}>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                          gap: "15px",
                        }}
                      >
                        {/* Contact Number */}
                        <div>
                          <label>Contact Number</label>
                          <input
                            type="text"
                            name="contact"
                            placeholder="Auto-fetched Contact"
                            value={policyForm.contact || ""}
                            onChange={handlePolicyChange}
                            style={inputStyle}
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label>Email</label>
                          <input
                            type="email"
                            name="email"
                            placeholder="Auto-fetched Email"
                            value={policyForm.email || ""}
                            onChange={handlePolicyChange}
                            style={inputStyle}
                          />
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



                        {/*
                        <select name="company" value={policyForm.company|| ""}  disabled = {isPolicyFetched} >
                          {!isPolicyFetched && <option value="">Select insurance company</option>}
                          <option value="LIC">LIC</option>
                          <option value="HDFC Life">HDFC Life</option>
                          <option value="SBI Life">SBI Life</option>
                          <option value="Tata AIA">Tata AIA</option>
                        </select>
                        <select name="category" value={policyForm.category} onChange={handlePolicyChange} >
                          {!isPolicyFetched && <option value="">Select insurance Category</option>}
                          <option value="General Insurance">General Insurance</option>
                          <option value="Life Insurance">Life Insurance</option>
                          <option value={policyForm.category}>{policyForm.category || "Fetching..."}</option>
                        </select>
                        <select name="type" value={policyForm.type} onChange={handlePolicyChange} >
                          {!isPolicyFetched && <option value="">Select insurance type</option>}
                          <option value="Term">Term</option>
                          <option value="ULIP">ULIP</option>
                          <option value="Endowment">Endowment</option>
                          <option value={policyForm.type}>{policyForm.type || "Fetching..."}</option>
                        </select>
                        */}
                        <input type="text" name="premium" placeholder="Enter premium amount" value={policyForm.premium} onChange={handlePolicyChange} />
                        <select name="paymentMode" value={policyForm.paymentMode} onChange={handlePolicyChange}>
                          <option value="">Select payment mode</option>
                          <option>Monthly</option>
                          <option>Yearly</option>
                        </select>
                        <input type="date" name="startDate" value={policyForm.startDate} onChange={handlePolicyChange} />
                        <input type="date" name="maturityDate" value={policyForm.maturityDate} onChange={handlePolicyChange} />
                        <input type="text" name="branch" placeholder="Enter branch name" value={policyForm.branch} onChange={handlePolicyChange} />
                        {/* Insurance Company */}
                        <div>
                          <label>Insurance Company</label>
                          <select
                            name="company"
                            value={policyForm.company || ""}
                            onChange={handlePolicyChange}
                            style={inputStyle}
                          >
                            <option value="">Select Insurance Company</option>
                            <option>LIC</option>
                            <option>HDFC Life</option>
                          </select>
                        </div>

                        {/* Insurance Category */}
                        <div>
                          <label>Insurance Category</label>
                          <div style={{ display: "flex", gap: "20px", marginTop: "8px" }}>
                            <label>
                              <input
                                type="radio"
                                name="category"
                                value="Life Insurance"
                                checked={policyForm.category === "Life Insurance"}
                                onChange={handlePolicyChange}
                              />
                              Life
                            </label>
                            <label>
                              <input
                                type="radio"
                                name="category"
                                value="General Insurance"
                                checked={policyForm.category === "General Insurance"}
                                onChange={handlePolicyChange}
                              />
                              General
                            </label>
                          </div>
                        </div>

                        {/* Insurance Type */}
                        <div>
                          <label>Insurance Type</label>
                          <select
                            name="type"
                            value={policyForm.type || ""}
                            onChange={handlePolicyChange}
                            style={inputStyle}
                          >
                            <option value="">Select Insurance Type</option>
                            <option>Term</option>
                            <option>ULIP</option>
                          </select>
                        </div>

                        {/* Premium */}
                        <div>
                          <label>Premium Amount</label>
                          <input
                            type="number"
                            name="premium"
                            placeholder="Enter Premium Amount"
                            value={policyForm.premium || ""}
                            onChange={handlePolicyChange}
                            style={inputStyle}
                          />
                        </div>

                        {/* Payment Mode */}
                        <div>
                          <label>Payment Mode</label>
                          <select
                            name="paymentMode"
                            value={policyForm.paymentMode || ""}
                            onChange={handlePolicyChange}
                            style={inputStyle}
                          >
                            <option value="">Select Payment Mode</option>
                            <option>Monthly</option>
                            <option>Quarterly</option>
                            <option>Yearly</option>
                          </select>
                        </div>

                        {/* Start Date */}
                        <div>
                          <label>Policy Start Date</label>
                          <input
                            type="date"
                            name="startDate"
                            value={policyForm.startDate || ""}
                            onChange={handlePolicyChange}
                            style={inputStyle}
                          />
                        </div>

                        {/* Maturity Date */}
                        <div>
                          <label>Maturity Date</label>
                          <input
                            type="date"
                            name="maturityDate"
                            value={policyForm.maturityDate || ""}
                            onChange={handlePolicyChange}
                            style={inputStyle}
                          />
                        </div>
                      </div>

                      {/* Save & Reset Buttons */}
                      <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                        <button
                          type="button"
                          style={saveButtonStyle}
                          onClick={handleSavePolicy}
                        >
                          Save Member & Policy
                        </button>
                        <button
                          type="button"
                          style={resetButtonStyle}
                          onClick={handleResetForms}
                        >
                          Reset
                        </button>
                      </div>
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
                      <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Name</th>
                      <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Relation</th>
                      <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Age</th>
                      <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Status</th>
                      <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {familyList.length > 0 ? familyList.map((member, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #dee2e6' }}>
                        <td style={{ padding: '10px' }}>{member.name}</td>
                        <td style={{ padding: '10px' }}>{member.relation}</td>
                        <td style={{ padding: '10px' }}>{member.age}</td>
                        <td style={{ padding: '10px' }}>
                          <span style={{ backgroundColor: '#28a745', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }}>
                            {member.status || 'Active'}
                          </span>
                        </td>
                        <td style={{ padding: '10px' }}>
                          <button 
                            onClick={() => handleDelete(i)}
                            style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                          No family members added yet
                        </td>
                      </tr>
                    )}
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