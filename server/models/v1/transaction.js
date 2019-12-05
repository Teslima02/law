const { Schema, model } = require('mongoose');

const Transaction = new Schema(
  {
    sentBy: { type: Schema.Types.ObjectId, ref: 'accounts' },
    receivedBy: { type: Schema.Types.ObjectId, ref: 'accounts' },
    amount: { type: Number },
    status: {
      type: String,
      enum: ['successful', 'pending', 'failed'],
      required: true,
    },
    type: {
      type: String,
      lowercase: true,
      trim: true,
      enum: ['credit', 'debit'],
    },
  },
  { timestamps: true },
);

module.exports = model('transactions', Transaction);
