const { Schema, model } = require('mongoose');

const Business = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    description: String,
    admins: { type: [Schema.Types.ObjectId], ref: 'accounts' },
    states: { type: [Schema.Types.ObjectId], ref: 'states' },
    country: { type: Schema.Types.ObjectId, ref: 'countries' },
    services: {
      type: String,
      lowercase: true,
      trim: true,
      enum: [
        'airtime',
        'restaurant',
        'buycashtoken',
        'giftcashtoken',
        'changecashtokenepin',
        'redeemcashtokenwins',
      ],
    },
    helperKey: String,
    email: { type: String /* , index: { unique: true } */ },
    phone: { type: String, required: true },
    website: { type: String, required: true },
    bank: String,
    accountName: String,
    accountNo: String,
    subAccountId: String,
    active: Boolean,
  },
  { timestamps: true },
);

module.exports = model('businesses', Business);
