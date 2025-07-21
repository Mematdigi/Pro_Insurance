const express = require("express");
const router = express.Router();
const {
  getCustomerById,
  updateCustomer,
} = require("../controllers/customerController");

router.get("customers/:id", getCustomerById);
router.put("customers/:id", updateCustomer);

module.exports = router;
