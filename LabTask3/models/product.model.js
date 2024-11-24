const mongoose = require("mongoose");
const productSchema = mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      index: true,
      unique: true,
    },
    brand: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, lowercase: true, trim: true },
    
  },
  { timestamps: true }
);

const product = mongoose.model("product", productSchema);
module.exports = product;