const { Schema, model } = require('mongoose');

const WalletSession = new Schema(
  {
    user: { type: String, required: true },
    statusCode: { type: Number },
    accessToken: { type: String },
    expires: { type: Date },
  },
  { timestamps: true },
);

module.exports = model('wallet-sessions', WalletSession);
