const { Schema, model } = require('mongoose');

const Country = new Schema(
  {
    name: { type: String, required: true },
    isoCode: String,
    isoCode2: String,
  },
  { timestamps: true },
);

module.exports = model('countries', Country);
