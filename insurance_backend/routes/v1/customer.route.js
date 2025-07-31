const express = require("express");
const router = express.Router();
const {customerController} = require("../../controllers/index");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() })


 router.get("customers/:id", customerController.getCustomerById);
 router.put("customers/:id", customerController.updateCustomer);

router.post('/pdf-reader/:customerId', upload.single('file'),customerController.handlePDFUpload);
// Fetch customer policy
router.get("/customer-fetch-policy/:customerId",customerController.getCustomerPolicy);

// Fetch insured members
router.get("/insured-members/:customerId", customerController.getCustomerInsuredMembers);

module.exports = router;
