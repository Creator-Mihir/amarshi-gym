const mongoose = require('mongoose');

const attendanceSchema = mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, default: 'Present' }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);