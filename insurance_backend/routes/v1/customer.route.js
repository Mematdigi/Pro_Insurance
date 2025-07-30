const express = require("express");
const router = express.Router();
const {customerController} = require("../../controllers/index");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() })


// router.get("customers/:id", customerController.getCustomerById);
// router.put("customers/:id", customerController.updateCustomer);
router.post('/pdf-reader/:customerId', upload.single('file'),customerController.handlePDFUpload);

module.exports = router;
