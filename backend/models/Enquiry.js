const mongoose = require('mongoose');

const enquirySchema = mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String },
    status: { 
        type: String, 
        enum: ['new', 'contacted', 'closed'], 
        default: 'new' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);