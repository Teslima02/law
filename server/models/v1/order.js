const { Schema, model } = require('mongoose');

const Order = new Schema(
  {
    orderId: { type: String, required: true },
    payment: { type: Schema.Types.ObjectId, ref: 'payments' },
    business: { type: Schema.Types.ObjectId, ref: 'business' },
    total: { type: String },
    service: { type: String },
    data: Schema.Types.Mixed,
    businessKey: { type: String },
    status: {
      type: String,
      lowercase: true,
      trim: true,
      enum: ['shipped', 'fail', 'pending', 'ready'],
    },
    user: { type: String },
  },
  { timestamps: true },
);

module.exports = model('order', Order);
