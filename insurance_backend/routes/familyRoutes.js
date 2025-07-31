const express = require("express");
const router = express.Router();
const familyController = require("../controllers/familyController");

router.post("/checkOrCreate", familyController.checkOrCreateGroup);
router.post("/add/:groupId", familyController.addFamilyMember);
router.get("/group/:groupId",familyController.getFamilyGroupDetails)
router.get('/search-member/:name', familyController.searchMemberByName);
router.get("/check-policy/:policyNumber", familyController.checkPolicyByNumber);






module.exports = router;
