const express = require("express");
const router = express.Router();
const {
    customerController
} = require("../../controllers/index");

router.get("customers/:id", customerController.getCustomerById);
router.put("customers/:id", customerController.updateCustomer);
router.post('/pdf-reader', customerController.handlePDFUpload);

module.exports = router;
