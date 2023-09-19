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
  purchaseDate: { type: Date, default: Date.now },
});

const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;
