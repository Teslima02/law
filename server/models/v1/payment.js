const { Schema, model } = require('mongoose');

const Payment = new Schema(
  {
    name: { type: String },
    business: { type: Schema.Types.ObjectId, ref: 'business' },
    product: { type: Schema.Types.ObjectId, ref: 'products' },
    user: { type: String },
    txnRef: String,
    intent: String,
    status: {
      type: String,
      lowercase: true,
      trim: true,
      enum: ['sent', 'fail', 'approve'],
    },
    data: Schema.Types.Mixed,
    amount: String,
    channel: String,
    method: String,
    comments: String,
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = model('payments', Payment);
