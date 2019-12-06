const { Schema, model } = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const Attendee = new Schema({
  firstName: String,
  middleName: String,
  lastName: String,
  username: { type: String },
  email: { type: String, index: { unique: true } },
  phone: { type: String, required: true },
  // roleId: {
  //   type: String,
  //   lowercase: true,
  //   trim: true,
  //   enum: ['admin', 'staff', 'agent', 'customer'],
  // },
  address: String,
  gender: String,
  image: String,
  createdAt: { type: Date, default: Date.now },
});

// Attendee.plugin(passportLocalMongoose);

module.exports = model('attendees', Attendee);
