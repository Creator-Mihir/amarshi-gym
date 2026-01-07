const mongoose = require('mongoose');

const planSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a plan name'],
      trim: true, // Removes extra spaces
    },
    durationInMonths: {
      type: Number,
      required: [true, 'Please add the duration in months'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
    features: {
      type: [String], // This allows us to store a list like ["Cardio", "Sauna", "Personal Trainer"]
      required: [true, 'Please add at least one feature'],
    },
    isActive: {
      type: Boolean,
      default: true, // If false, this plan won't show up on the website (good for hiding old prices)
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Plan', planSchema);