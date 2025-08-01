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
    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [memberQuery]);

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
      const calculatedAge = calculateAge(value);
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value,
        age: calculatedAge,
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value,
      }));
    }
    if (name === "memberName") {
      setMemberQuery(value);
      setShowSuggestions(value.length > 0);
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
      const memberPayload = {
        agentId: user?.id,
        name: form.memberName,
        relation: form.relation,
        age: form.age,
        dob: form.dob || "",
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

      const checkRes = await fetch(`http://localhost:5000/api/check/${policyForm.policyNumber}`);
      const checkData = await checkRes.json();

      if (checkRes.ok && checkData.exists) {
        alert("✅ Member added successfully!");
        const updatedMembers = await fetch(`http://localhost:5000/api/family/group/${groupId}`);
        const updatedData = await updatedMembers.json();
        if (updatedMembers.ok) {
          setFamilyList(updatedData.familyMembers || []);
        }
        return;
      }

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
        },
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

  const inputStyle = { width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "14px", outline: "none" };
  const buttonPrimary = { backgroundColor: "#1e40af", color: "white", border: "none", padding: "10px 15px", borderRadius: "6px", fontWeight: "600", cursor: "pointer" };
  const buttonSuccess = { backgroundColor: "#16a34a", color: "white", border: "none", padding: "10px 15px", borderRadius: "6px", fontWeight: "600", cursor: "pointer" };
  const buttonReset = { backgroundColor: "#dc2626", color: "white", border: "none", padding: "10px 15px", borderRadius: "6px", fontWeight: "600", cursor: "pointer" };
  const suggestionListStyle = { listStyle: "none", margin: 0, padding: "5px", border: "1px solid #ccc", borderRadius: "4px", background: "white", position: "absolute", zIndex: 1000, width: "100%", maxHeight: "150px", overflowY: "auto", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" };
  const suggestionItemStyle = { padding: "8px", cursor: "pointer", borderBottom: "1px solid #eee" };

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
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px", marginBottom: "20px" }}>
                    <input type="text" name="policyNumber" placeholder="Enter policy number" value={form.policyNumber} onChange={handleMemberChange} style={inputStyle} readOnly />
                    <input type="text" name="primaryHolder" placeholder="Enter primary holder name" value={form.primaryHolder} onChange={handleMemberChange} style={inputStyle} readOnly />

                    {/* Member Name with Suggestions */}
                    <div style={{ position: "relative" }}>
                      <label>Member Name *</label>
                      <input type="text" name="memberName" placeholder="Enter member name" value={form.memberName} onChange={(e) => { handleMemberChange(e); setMemberQuery(e.target.value); }} style={inputStyle} />
                      {showSuggestions && suggestions.length > 0 && (
                        <ul style={suggestionListStyle}>
                          {suggestions.map((sug) => (
                            <li key={sug._id} style={suggestionItemStyle} onClick={async () => {
                              setForm({ ...form, memberName: sug.name });
                              setSuggestions([]);
                              try {
                                const res = await fetch(`http://localhost:5000/api/by-id/${sug._id}`);
                                const data = await res.json();
                                if (res.ok && data) {
                                  setPolicyForm({
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
                                    branch: "",
                                  });
                                  setIsPolicyFetched(true);
                                }
                              } catch (err) {
                                console.error("Error fetching policy data:", err);
                              }
                            }}>
                              {sug.name} - ({sug.contact || "No Contact"})
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <select name="relation" value={form.relation} onChange={handleMemberChange} style={inputStyle}>
                      <option value="">Select relation</option>
                      <option>Wife</option>
                      <option>Son</option>
                      <option>Daughter</option>
                      <option>Mother</option>
                      <option>Father</option>
                    </select>

                    <input type="date" name="dob" value={form.dob} onChange={handleMemberChange} style={inputStyle} />
                    <input type="text" name="age" placeholder="Enter age" value={form.age} onChange={handleMemberChange} style={inputStyle} />
                  </div>

                  {/* Action Buttons */}
                  <div style={{ marginTop: "15px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button style={buttonPrimary} onClick={handleAddMember}>+ Add Member</button>
                    <button style={buttonReset} onClick={() => setForm({ policyNumber: "", primaryHolder: "", memberName: "", relation: "", dob: "", age: "" })}>Reset Form</button>
                    {isMemberFormValid && !showPolicyForm && <button style={{ ...buttonPrimary, marginTop: "10px" }} onClick={() => setShowPolicyForm(true)}>+ Add Policy</button>}
                  </div>

                  {/* Policy Form */}
                  {showPolicyForm && (
                    <div style={{ marginTop: "20px" }}>
                      <h4>Add Policy Details</h4>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
                        <input type="text" name="policyNumber" placeholder="Enter policy number" value={policyForm.policyNumber} onChange={handlePolicyChange} style={inputStyle} />
                        <input type="text" name="policyHolderName" placeholder="Enter policy holder name" value={policyForm.policyHolderName} onChange={handlePolicyChange} style={inputStyle} />
                        <input type="text" name="contact" placeholder="Enter contact number" value={policyForm.contact} onChange={handlePolicyChange} style={inputStyle} />
                        <input type="email" name="email" placeholder="Enter email address" value={policyForm.email} onChange={handlePolicyChange} style={inputStyle} />
                        <select name="company" value={policyForm.company} onChange={handlePolicyChange} style={inputStyle}>
                          <option value="">Select insurance company</option>
                          <option>LIC</option>
                          <option>HDFC Life</option>
                          <option>SBI Life</option>
                          <option>Tata AIA</option>
                        </select>
                        <select name="category" value={policyForm.category} onChange={handlePolicyChange} style={inputStyle}>
                          <option value="">Select insurance category</option>
                          <option>Life Insurance</option>
                          <option>General Insurance</option>
                        </select>
                        <select name="type" value={policyForm.type} onChange={handlePolicyChange} style={inputStyle}>
                          <option value="">Select insurance type</option>
                          <option>Term</option>
                          <option>ULIP</option>
                          <option>Endowment</option>
                        </select>
                        <input type="text" name="premium" placeholder="Enter premium amount" value={policyForm.premium} onChange={handlePolicyChange} style={inputStyle} />
                        <select name="paymentMode" value={policyForm.paymentMode} onChange={handlePolicyChange} style={inputStyle}>
                          <option value="">Select payment mode</option>
                          <option>Monthly</option>
                          <option>Yearly</option>
                        </select>
                        <input type="date" name="startDate" value={policyForm.startDate} onChange={handlePolicyChange} style={inputStyle} />
                        <input type="date" name="maturityDate" value={policyForm.maturityDate} onChange={handlePolicyChange} style={inputStyle} />
                        <input type="text" name="branch" placeholder="Enter branch name" value={policyForm.branch} onChange={handlePolicyChange} style={inputStyle} />
                      </div>
                      <button style={{ ...buttonSuccess, marginTop: "10px" }} onClick={handleSavePolicy}>Save Member & Policy</button>
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
                    <tr style={{ backgroundColor: "#f8f9fa" }}>
                      <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Name</th>
                      <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Relation</th>
                      <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Age</th>
                      <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Status</th>
                      <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {familyList.map((member, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #dee2e6" }}>
                        <td style={{ padding: "10px" }}>{member.name}</td>
                        <td style={{ padding: "10px" }}>{member.relation}</td>
                        <td style={{ padding: "10px" }}>{member.age}</td>
                        <td style={{ padding: "10px" }}>
                          <span style={{ backgroundColor: "#28a745", color: "white", padding: "4px 8px", borderRadius: "12px", fontSize: "12px" }}>{member.status || "Active"}</span>
                        </td>
                        <td style={{ padding: "10px" }}>
                          <button onClick={() => handleDelete(i)} style={{ backgroundColor: "#dc2626", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                    {familyList.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ padding: "20px", textAlign: "center", color: "#666" }}>No family members added yet</td>
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
