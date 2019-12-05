const { Schema, model } = require('mongoose');

const MenuItem = new Schema(
  {
    title: { type: String, required: true },
    parent: { type: Schema.Types.ObjectId, ref: 'menu-items' },
    key: { type: String, required: true },
    businessType: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = model('menu-items', MenuItem);
