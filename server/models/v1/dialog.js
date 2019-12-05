const { Schema, model } = require('mongoose');

const Dialog = new Schema(
  {
    type: { type: String, required: true },
    question: { type: String, required: true },
    key: { type: String, required: true },
    processor: String,
    linked: Boolean,
    businessType: { type: String, required: true },
    index: Number,
    business: { type: Schema.Types.ObjectId, ref: 'businesses' },
  },
  { timestamps: true },
);

module.exports = model('dialogs', Dialog);
