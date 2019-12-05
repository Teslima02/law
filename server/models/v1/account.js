const { Schema, model } = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const Account = new Schema({
  createdBy: { type: Schema.Types.ObjectId, ref: 'accounts' },
  wallet: {
    walletId: { type: Number, unique: true },
    balance: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  },
  firstName: String,
  middleName: String,
  lastName: String,
  password: String,
  username: { type: String },
  email: { type: String, index: { unique: true } },
  phone: { type: String, required: true },
  roleId: {
    type: String,
    lowercase: true,
    trim: true,
    enum: ['admin', 'staff', 'agent', 'customer'],
  },
  address: String,
  gender: String,
  image: String,
  country: String,
  state: String,
  city: String,
  token: String,
  createdAt: { type: Date, default: Date.now },
});

Account.plugin(passportLocalMongoose);

module.exports = model('accounts', Account);
