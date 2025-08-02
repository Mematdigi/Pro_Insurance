import React, { useState, useEffect } from "react";
import { data, useNavigate } from "react-router-dom";
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
  const [showSuggestions, setShowSuggestions] = useState(false);

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
        setShowSuggestions(false);
        return;
      }
      try {
        const res = await fetch(`http://localhost:5000/api/family/search-member/${memberQuery}`);
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch (err) {
        console.error("Error fetching suggestions", err);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };
    fetchSuggestions();
  },[memberQuery]);

  // Auto-update policy form fields when adding a policy for a new member
  /*
  useEffect(() => {
    if (showPolicyForm && form.memberName) {
      setPolicyForm((prev) => ({
        ...prev,
        policyHolderName: form.memberName,
      }));
    }
  }, [showPolicyForm, form.memberName]);
  */

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
    if (name === "dob") {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value,
        age: calculateAge(value),
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value,
      }));
      if (name === "memberName") setMemberQuery(value);
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

    // Validate required policy fields
    if (!policyForm.policyHolderName || !policyForm.contact || !policyForm.company || 
        !policyForm.category || !policyForm.type || !policyForm.premium || 
        !policyForm.paymentMode || !policyForm.startDate || !policyForm.maturityDate) {
      alert("Please fill all required policy fields.");
      return;
    }

    try {
      // Step 1: Save the member first
      console.log("📝 Saving member...");
      const memberPayload = {
        agentId: user?.id,
        name: form.memberName,
        relation: form.relation,
        age: parseInt(form.age), // Convert to number
        dob: form.dob || "",
      };

      console.log("Member payload:", memberPayload);

      const memberRes = await fetch(`http://localhost:5000/api/family/add/${groupId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(memberPayload),
      });

      const memberData = await memberRes.json();
      console.log("Member response:", memberData);

      if (!memberRes.ok) {
        console.error("❌ Member save failed:", memberData);
        alert(memberData.msg || "Failed to save member.");
        return;
      }

      console.log("✅ Member saved successfully!");

      // Step 2: Check if policy already exists (only if policy number is provided)
      
      const checkRes = await fetch(`http://localhost:5000/api/check/${policyForm.policyNumber}`);
      const checkData = await checkRes.json();
      console.log("Policy check response:", checkData);

      if (checkRes.ok && checkData.exists) {
        console.log("✅ Policy already exists, skipping policy creation");
        alert("✅ Member added successfully!")

        const updatedMembers = await fetch(`http://localhost:5000/api/family/group/${groupId}`);
        const updatedData = await updatedMembers.json();
        if (updatedMembers.ok) {
        setFamilyList(updatedData.familyMembers || []);
        console.log("✅ Family list updated");
      }
      handleResetForms();
      return;
    }
        
    const policyPayload = {
      policyNumber: policyForm.policyNumber,
      customerName: policyForm.policyHolderName, // ✅ Fixed mapping
      customerPhone: policyForm.contact,
      customerEmail: policyForm.email || "",
      company: policyForm.company,
      insuranceType: policyForm.category,
      policyType: policyForm.type,
      agentId: user?.id,
      policyDetails: {
        premium: parseFloat(policyForm.premium), // Convert to number
        paymentMode: policyForm.paymentMode,
        startDate: policyForm.startDate,
        endDate: policyForm.maturityDate, // ✅ Fixed mapping
        branch: policyForm.branch || "",
      },
    };
    console.log("Policy payload:", policyPayload);
    const policyRes = await fetch("http://localhost:5000/api/policies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(policyPayload),
    });

    const policyData = await policyRes.json();
    console.log("Policy response:", policyData);
    if (!policyRes.ok) {
      console.error("❌ Policy save failed:", policyData);
      alert(policyData.msg || "Failed to save policy.");
      return;
    }
    alert("✅ Member and Policy saved successfully!");

      // Step 4: Refresh family members list
      
    
    const updatedMembers = await fetch(`http://localhost:5000/api/family/group/${groupId}`);
    const updatedData = await updatedMembers.json();
    if (updatedMembers.ok) {
      setFamilyList(updatedData.familyMembers || []);
      console.log("✅ Family list updated");
    }
  } catch (refreshError) {
    console.error("Failed to refresh family list:", refreshError);
  }
  handleResetForms();

};

  const handleDelete = async (index) => {
    try {
      const memberId = familyList[index]._id;
      if (!memberId) return;

      const deleteRes = await fetch(`http://localhost:5000/api/family/delete/${groupId}/${memberId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (deleteRes.ok) {
        setFamilyList((prevList) => prevList.filter((_, i)=> i !== index));
        alert("✅ Member deleted successfully!");
      } else {
        alert("❌ Failed to delete member.");
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      alert("❌ Error deleting member.");
    }
  };

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
    setShowSuggestions(false);
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

  const buttonPrimary = { backgroundColor: "#1e40af", color: "white", border: "none", padding: "10px 15px", borderRadius: "6px", fontWeight: "600", cursor: "pointer" };
  
  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#fff", padding: "20px", borderBottom: "1px solid #e0e0e0", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <button onClick={() => navigate("/agent/dashboard")} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#007bff" }}>
              <FaArrowLeft />
            </button>
            <div>
              <h3 style={{ margin: "0 0 5px 0", color: "#333" }}>Add Family Member</h3>
              <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>Add family members to existing policy and manage their policies</p>
            </div>
          </div>
          <button style={{ backgroundColor: "#007bff", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer", fontSize: "14px" }}>
            <FaEye style={{ marginRight: "5px" }} /> View Existing Policy
          </button>
        </div>
      </div>

      {/* Search Section */}
      {!formSubmitted && (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
          <h3 style={{ color: "#1d4ed8", marginBottom: "20px" }}>Search Customer</h3>
          <div style={{ display: "flex", gap: "20px", backgroundColor: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: "bold" }}>Customer Name *</label>
              <input type="text" placeholder="Enter customer name" value={searchCustomer.name} onChange={(e) => setSearchCustomer({ ...searchCustomer, name: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: "bold" }}>Policy Number *</label>
              <input type="text" placeholder="Enter policy number" value={searchCustomer.policyNumber} onChange={(e) => setSearchCustomer({ ...searchCustomer, policyNumber: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ alignSelf: "flex-end" }}>
              <button onClick={handleSearchCustomer} style={{ ...buttonPrimary, backgroundColor: "#2563eb", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaSearch /> Search
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {formSubmitted && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
          {/* Left Section */}
          <div style={{ flex: "1" }}>
            <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
              {/* Group ID */}
              <div style={{ backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "5px", marginBottom: "20px", border: "1px solid #e9ecef" }}>
                <label style={{ fontWeight: "bold", color: "#495057", fontSize: "14px" }}>Group ID:</label>
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#007bff", marginTop: "5px" }}>{groupId}</div>
              </div>
           
             {/* Member Form */}
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
                    {/* Policy Number (Primary Holder Policy) */}
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

                    {/* Member Name with Suggestions */}
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
                            if (memberQuery.length > 0) setShowSuggestions(true);
                          }}
                          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                          style={{ ...inputStyle, paddingRight: "35px" }}
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              const res = await fetch('http://localhost:5000/api/family/search-member/all');
                              const data = await res.json();
                              setSuggestions(data);
                              setShowSuggestions(true);
                              setMemberQuery("");
                            } catch (err) {
                              console.error("Error fetching all members:", err);
                              setMemberQuery("a");
                              setShowSuggestions(true);
                            }
                          }}
                          style={{
                            position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)",
                            background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#666"
                          }}
                        >
                          ▼
                        </button>
                      </div>

                      {/* Suggestions Dropdown */}
                      {showSuggestions && suggestions?.length > 0 && (
                        <ul style={{
                          listStyle: "none", margin: 0, padding: "5px", border: "1px solid #ccc",
                          borderRadius: "4px", background: "white", position: "absolute", zIndex: 2000,
                          width: "100%", maxHeight: "150px", overflowY: "auto", boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                        }}>
                          {suggestions.map((sug) => (
                            <li key={sug._id}
                              style={{ padding: "8px", cursor: "pointer", borderBottom: "1px solid #eee" }}
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={async () => {
                                setForm((prev) => ({ ...prev, memberName: sug.name }));
                                setSuggestions([]);
                                setShowSuggestions(false);
                                setMemberQuery("");

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
                                    setIsPolicyFetched(true)
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
                              <div style={{ fontWeight: "500" }}>{sug.name}</div>
                              <div style={{ fontSize: "12px", color: "#666" }}>{sug.contact || "No Contact"}</div>
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
                        onChange={handleMemberChange}
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

                    {/* DOB */}
                    <div>
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        name="dob"
                        value={form.dob || ""}
                        onChange={handleMemberChange}
                        style={inputStyle}
                      />
                    </div>

                    {/* Age */}
                    <div>
                      <label>Age (Auto-calculated)</label>
                      <input
                        type="text"
                        name="age"
                        placeholder="Age will be calculated from DOB"
                        value={form.age || ""}
                        readOnly
                        style={{ ...inputStyle, backgroundColor: form.dob ? "#f8f9fa" : "white" }}
                      />
                    </div>
                  </div>

                  {/* Add Policy Button */}
                  {isMemberFormValid && !showPolicyForm && (
                    <button
                      type="button"
                      style={addPolicyButtonStyle}
                      onClick={() => setShowPolicyForm(true)}
                    >
                      + Add Policy
                    </button>
                  )}

                  {/* Policy Form */}
                  {showPolicyForm && (
                    <div className="policy-form" style={{ marginTop: "20px" }}>
                      <div style={{
                        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px"
                      }}>
                        {/* Policy Number */}
                        <div>
                          <label>Policy Number</label>
                          <input
                            type="text"
                            name="policyNumber"
                            placeholder="Enter Policy Number (optional)"
                            value={policyForm.policyNumber || ""}
                            onChange={handlePolicyChange}
                            style={inputStyle}
                          />
                        </div>

                        

                        {/* Policy Holder Name */}
                        <div>
                          <label>Policy Holder Name *</label>
                          <input
                            type="text"
                            name="policyHolderName"
                            placeholder="Auto-fetched Member Name"
                            value={policyForm.policyHolderName || ""}
                            onChange={handlePolicyChange}
                            style={inputStyle}
                          />
                        </div>

                        {/* Contact */}
                        <div>
                          <label>Contact Number *</label>
                          <input
                            type="text"
                            name="contact"
                            placeholder="Enter Contact Number"
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
                            placeholder="Enter Email"
                            value={policyForm.email || ""}
                            onChange={handlePolicyChange}
                            style={inputStyle}
                          />
                        </div>

                        {/* Insurance Company */}
                        <div>
                          <label>Insurance Company *</label>
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
                              /> Life
                            </label>
                            <label>
                              <input
                                type="radio"
                                name="category"
                                value="General Insurance"
                                checked={policyForm.category === "General Insurance"}
                                onChange={handlePolicyChange}
                              /> General
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

                      {/* Save & Reset */}
                      <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                        <button type="button" style={saveButtonStyle} onClick={handleSavePolicy}>
                          Save Member & Policy
                        </button>
                        <button type="button" style={resetButtonStyle} onClick={handleResetForms}>
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
          <div style={{ flex: "1" }}>
            <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
              <h5 style={{ marginBottom: "15px", color: "#333" }}>Existing Family Members</h5>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
                    {familyList && familyList.length > 0 ? familyList.map((member, i) => (
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