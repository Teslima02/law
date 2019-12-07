const { Schema, model } = require('mongoose');
// const passportLocalMongoose = require('passport-local-mongoose');

const Attendee = new Schema({
  firstName: String,
  lastName: String,
  // email: { type: String, index: { unique: true } },
  email: { type: String },
  // phone: { type: String },
  address: String,
  createdAt: { type: Date, default: Date.now },
});

// Attendee.plugin(passportLocalMongoose);

module.exports = model('attendees', Attendee);
