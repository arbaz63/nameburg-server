const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  domains: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      discount: { type: Number, default: 0 },
    },
  ],
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  purchaseDate: { type: Date, default: Date.now },
});

const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;
