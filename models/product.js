const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    lowercase: true,
    enum: ["fruit", "vegetable", "dairy", "fungi"],
  },
  qty: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
    validate: {
      validator: Number.isInteger,
      message: `{VALUE} must be a whole number`,
    },
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
