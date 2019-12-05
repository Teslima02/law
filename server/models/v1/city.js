const { Schema, model } = require('mongoose');

const City = new Schema(
  {
    name: { type: String, required: true },
    state: { type: Schema.Types.ObjectId, ref: 'states' },
    country: { type: Schema.Types.ObjectId, ref: 'countries' },
  },
  { timestamps: true },
);

module.exports = model('cities', City);
