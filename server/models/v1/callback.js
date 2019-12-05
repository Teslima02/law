const { Schema, model } = require('mongoose');

const Callback = new Schema(
  {
    channel: { type: Schema.Types.ObjectId, ref: 'channels' },
    phone: String,
    amount: String,
    payloadString: String,
    secret: { type: String, required: true },
    service: { type: Schema.Types.ObjectId, ref: 'services' },
    fulfilled: { type: Boolean, default: false },
    txnRef: String,
  },
  { timestamps: true },
);

module.exports = model('callbacks', Callback);
