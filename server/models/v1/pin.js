const { Schema, model } = require('mongoose');

const Pin = new Schema(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: 'accounts' },
    usedBy: { type: Schema.Types.ObjectId, ref: 'accounts' },
    pin: { type: Number, unique: true },
    amount: { type: Number },
    sent: { type: Boolean },
    email: { type: String },
    from: {
      type: String,
      lowercase: true,
      trim: true,
      enum: ['staff', 'agent'],
    },
    status: {
      type: String,
      lowercase: true,
      trim: true,
      default: 'unused',
      enum: ['used', 'unused'],
    },
  },
  { timestamps: true },
);

module.exports = model('pins', Pin);
