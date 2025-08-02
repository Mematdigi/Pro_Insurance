const FamilyGroup = require("../models/FamilyGroup");
const Policy = require('../models/AgentPolicies');
const mongoose = require("mongoose");

exports.checkOrCreateGroup = async (req, res) => {
  try {
    const {agentId, primaryHolder,policyNumber } = req.body;
    console.log("Incoming:", { agentId, primaryHolder, policyNumber });

    if (!agentId || !primaryHolder || !policyNumber) {
        return res.status(400).json({ msg: "Missing required fields" });
    }
    const policyExists = await Policy.findOne({
      customerName: { $regex: new RegExp(`^${primaryHolder.trim()}$`, "i") },
      policyNumber: policyNumber.trim(),
      agentId: new mongoose.Types.ObjectId(agentId),
    });
    console.log("Policy exists:", policyExists);
    if (!policyExists) {
    return res.status(404).json({ msg: "Policy holder not found in DB" });
  }

  
  let group = await FamilyGroup.findOne({
    primaryHolder: {$regex: new RegExp(`^${primaryHolder.trim()}$`,"i")},
    policyNumber: policyNumber.trim(),
   });
  if (!group) {
    const newGroupId = "GRP" + Math.floor(100000 + Math.random() * 900000);
      const newGroup = new FamilyGroup({
        agentId,
        groupId: newGroupId,
        primaryHolder,
        policyNumber,
        familyMembers: [],
      });
      await newGroup.save();
      group = newGroup;
    }


    res.status(200).json({
      groupId: group.groupId, msg: "Family group checked/created successfully"});
  } catch (err) {
    console.error("Family group creation error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.checkPolicyByNumber = async (req, res) => {
  try {
    const { policyNumber } = req.params;

    if (!policyNumber) {
      return res.status(400).json({ msg: "Policy number is required" });
    }

    // Find policy in DB
    const policy = await Policy.findOne({ policyNumber: policyNumber });

    if (!policy) {
      return res.status(404).json({ exists: false, msg: "Policy not found" });
    }

    // Return policy holder details if found
    return res.status(200).json({
      exists: true,
      policy: {
        customerName: policy.customerName,
        policyNumber: policy.policyNumber,
        agentId: policy.agentId,
      }
    });
  } catch (error) {
    console.error("❌ Error checking policy:", error);
    res.status(500).json({ msg: "Server error" });
  }
};


exports.addFamilyMember = async (req, res) => {
  const { groupId } = req.params;
  const { name , relation, age, dob,} = req.body;
  if (!groupId || !name|| !relation || !age) {
    console.log("Missing required fields:", { groupId, name, relation, age });
    return res.status(400).json({ msg: "Missing required fields" });
  } 
  try {
    const  member = {
      name,
      relation,
      age,
      dob,
      status: "Active",
    };
    const group = await FamilyGroup.findOneAndUpdate(
      { groupId },
      {$push: { familyMembers: member } },
      {new:true}
  );
    if (!group) {
      return res.status(404).json({ msg: "Group not found" });
    }

     return res.status(200).json({ msg: "Member added successfully", group });
  } catch (err) {
    console.error("❌ Error adding member:", error);
    res.status(500).json({ msg: "Failed to fetch groups" });
  }
};


exports.getFamilyGroupDetails = async (req, res) => {
  const groupId = req.params.groupId?.trim().toUpperCase();

  try {
    const group = await FamilyGroup.findOne({ groupId });
    
    if (!group) {
      console.log("No group found for ID:", groupId)
      return res.status(404).json({ msg: "Group not found" });
    }
    
    return res.status(200).json({
          groupId: group.groupId,
          primaryHolder: group.primaryHolder,
          policyNumber: group.policyNumber,
          familyMembers: group.familyMembers, 
        });
  } catch (error) {
    console.error("❌ Error fetching family group:", error);
    res.status(500).json({ msg: "Server error" });
  }
};  


exports.searchMemberByName = async (req, res) => {
  try {
    const name = req.params.name?.trim();
    if (!name) {
      return res.status(400).json({ msg: "Name parameter is required" });
    }
    const results = await Policy.find({
      customerName: { $regex: name, $options: 'i' } 
    }).select("customerName customerPhone");
    return res.status(200).json(
      results.map(r => ({
        _id: r._id,
        name: r.customerName,
        contact: r.customerPhone || "No Phone"
      }))
    );
  } catch (error) {
    console.error("❌ Error searching member by name:", error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

exports.deleteFamilyMember = async (req, res) => {
  try {
    const { groupId, memberId } = req.params;

    if (!groupId || !memberId) {
      return res.status(400).json({ msg: "Group ID and Member ID are required" });
    }

    // Find the group and remove the member by ID
    const updatedGroup = await FamilyGroup.findOneAndUpdate(
      { groupId },
      { $pull: { familyMembers: { _id: memberId } } }, // ✅ Pull the member by ID
      { new: true }
    );

    if (!updatedGroup) {
      return res.status(404).json({ msg: "Family group not found" });
    }

    return res.status(200).json({
      msg: "Family member deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting family member:", error);
    return res.status(500).json({ msg: "Server error while deleting family member" });
  }
};