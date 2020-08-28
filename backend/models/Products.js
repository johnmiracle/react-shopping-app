const mongoose = require("mongoose");

const Productschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  countInStock: {
    type: Number,
    default: 0,
    required: true,
  },
  numReviews: {
    type: Number,
    default: 0,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
    required: true,
  },
  created_on: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", Productschema);
