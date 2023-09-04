const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  domains: [
    {
      domainname: { type: String, required: true },
      price: { type: Number, required: true },
      discount: { type: Number, default: 0 },
    },
  ],
  clientInformation: {
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
