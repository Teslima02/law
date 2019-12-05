const { Schema, model } = require('mongoose');

const Session = new Schema(
  {
    phoneNumber: { type: String, required: true },
    name: { type: String, required: true },
    sessionData: Schema.Types.Mixed,
    expiresOn: { type: Date, default: Date.now() },
    pin: { type: Number, required: true },
  },
  { timestamps: true },
);

module.exports = model('sessions', Session);
