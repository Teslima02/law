const { Schema, model } = require('mongoose');

const Talk = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    users: [{ type: Schema.Types.ObjectId, ref: 'attendees' }],
  },
  { timestamps: true },
);

module.exports = model('talks', Talk);
