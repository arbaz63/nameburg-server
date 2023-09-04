const express = require("express");

const { invoiceController } = require("../controllers");
const { isAdmin, authenticateToken, checkInvalidDomainName } = require("../middlewares");

const router = express.Router();

//Route to create an invoice
router.post("/", authenticateToken, isAdmin, checkInvalidDomainName, invoiceController.createInvoice)

//Route to get all invoices
router.get("/", authenticateToken, isAdmin, invoiceController.getInvoices)

//Route to get single invoice
router.get("/:id", authenticateToken, isAdmin, invoiceController.getInvoiceById)

module.exports = router;
