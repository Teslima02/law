const { Schema, model } = require('mongoose');

const Product = new Schema(
  {
    name: { type: String, required: true },
    branch: { type: Schema.Types.ObjectId, ref: 'branches' },
    image: String,
    price: Number,
    minPrep: Number,
    maxPrep: Number,
    sale: Boolean,
    durability: Number,
    minQty: Number,
    maxQty: Number,
    comments: String,
    category: String,
  },
  { timestamps: true },
);

module.exports = model('products', Product);
