const FamilyGroup = require("../models/FamilyGroup");

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
  const { name , relation, age, dob, occupation, nomineeName, nomineeRelation,} = req.body;
  if (!groupId || !name || !relation || !age) {
    return res.status(400).json({ msg: "Missing required fields" });
  } 
  try {
    const  member = {
      name,
      relation,
      age,
      dob,
      occupation,
      nomineeName,
      nomineeRelation,
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
