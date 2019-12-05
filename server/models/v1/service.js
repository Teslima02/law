const { Schema, model } = require('mongoose');

const Service = new Schema(
  {
    name: { type: String },
    business: { type: Schema.Types.ObjectId, ref: 'business' },
    agents: { type: [Schema.Types.ObjectId], ref: 'accounts' },
    category: {
      type: String,
      lowercase: true,
      trim: true,
      enum: [
        'travels',
        'restaurant',
        'airtime',
        'data-bundle',
        'hotels',
        'games',
        'electronics',
        'electricity',
        'cashtoken',
      ],
    },
  },
  { timestamps: true },
);

module.exports = model('services', Service);
