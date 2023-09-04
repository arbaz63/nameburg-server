/* eslint-disable no-underscore-dangle */
const db = require("../models");
require("dotenv").config();

const { Invoice, Domain } = db;

//Create an invoice
const createInvoice = async (req, res) => {
  try {
    const { domains, clientInformation } = req.body;
    // Create a new invoice document
    const newInvoice = new Invoice({
      domains,
      clientInformation,
    });

    // Save the new invoice to the database
    await newInvoice.save();

    res
      .status(201)
      .json({ message: "Invoice created successfully", invoice: newInvoice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Retrieve all invoices from the database
const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find();

    res.status(200).json({ invoices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Retrieve the invoice by its ID from the database
const getInvoiceById = async (req, res) => {
  try {
    const invoiceId = req.params.id;

    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json({ invoice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { createInvoice, getInvoices, getInvoiceById };
