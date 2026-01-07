const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // You might need to install this if not already present for User

const memberSchema = mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true }, // Make phone unique
  password: { type: String, required: true }, // <--- NEW
  plan: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['Active', 'Expired'], default: 'Active' },
}, { timestamps: true });

// Encrypt password before saving
memberSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to match password
memberSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Member', memberSchema);