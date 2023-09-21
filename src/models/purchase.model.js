const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  domains: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Domain", // This should match the model name for the Domain collection
      required: true,
    },
  ],
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  invoiceNo: {type: Number, default:0},
  purchaseDate: { type: Date, default: Date.now },
});

purchaseSchema.pre('save', async function (next) {
  try {
    if (!this.isNew) {
      // If the purchase is not new (updating), do nothing
      return next();
    }

    // Find the highest invoiceNo and increment it by 1
    const highestInvoice = await this.constructor.findOne().sort('-invoiceNo').exec();
    if (highestInvoice) {
      this.invoiceNo = highestInvoice.invoiceNo + 1;
    } else {
      // If there are no existing invoices, set invoiceNo to 1
      this.invoiceNo = 1;
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;
