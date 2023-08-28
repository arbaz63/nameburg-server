const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  domain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Domain",
    required: true,
  },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  purchaseDate: { type: Date, default: Date.now },
});

const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;
