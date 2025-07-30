const FamilyGroup = require("../models/FamilyGroup");
const Policy = require('../models/AgentPolicies');

exports.checkOrCreateGroup = async (req, res) => {
    const {agentId, primaryHolder,policyNumber } = req.body;

    if (!agentId || !primaryHolder || !policyNumber) {
        return res.status(400).json({ msg: "Missing required fields" });
    }
  try {
    let group = await FamilyGroup.findOne({primaryHolder, policyNumber });
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


    res.status(200).json({groupId: group.groupId, msg: "Family group checked/created successfully"});
  } catch (err) {
    console.error("Family group creation error:", err);
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