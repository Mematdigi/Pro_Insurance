const express = require("express");
const router = express.Router();
const familyController = require("../controllers/familyController");

router.post("/checkOrCreate", familyController.checkOrCreateGroup);
router.post("/add/:groupId", familyController.addFamilyMember);

module.exports = router;
