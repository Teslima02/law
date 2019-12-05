const { Schema, model } = require('mongoose');

const Branch = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String },
    city: { type: Schema.Types.ObjectId, ref: 'cities' },
    cities: { type: [Schema.Types.ObjectId], ref: 'cities' },
    agents: { type: [Schema.Types.ObjectId], ref: 'accounts' },
    business: { type: Schema.Types.ObjectId, ref: 'businesses' },
    returnable: { type: Boolean },
    returnPolicy: { type: String },
    shortName: { type: String },
    service: { type: String },
    weekdays: {
      type: [String],
      lowercase: true,
      trim: true,
      enum: [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ],
    },
  },
  { timestamps: true },
);

module.exports = model('branches', Branch);
