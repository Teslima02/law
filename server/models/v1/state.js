const { Schema, model } = require('mongoose');

const State = new Schema(
  {
    name: { type: String, required: true },
    country: { type: Schema.Types.ObjectId, ref: 'countries' },
  },
  { timestamps: true },
);

module.exports = model('states', State);
