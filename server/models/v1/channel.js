const { Schema, model } = require('mongoose');

const Channel = new Schema(
  {
    name: { type: String, required: true },
    secret: { type: String, required: true },
    description: String,
    domain: String,
    active: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = model('channels', Channel);
