const Enquiry = require('../models/Enquiry');

// @desc    Create new enquiry
// @route   POST /api/enquiries
// @access  Public
const createEnquiry = async (req, res) => {
    const { name, phone, message } = req.body;
    try {
        const enquiry = await Enquiry.create({ name, phone, message });
        res.status(201).json(enquiry);
    } catch (error) {
        res.status(400).json({ message: 'Could not save enquiry' });
    }
};

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private/Admin
const getAllEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find({}).sort({ createdAt: -1 });
        res.json(enquiries);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};



// @desc    Delete enquiry
// @route   DELETE /api/enquiries/:id
// @access  Private/Admin
const deleteEnquiry = async (req, res) => {
    try {
      const enquiry = await Enquiry.findById(req.params.id);
      if (!enquiry) {
        return res.status(404).json({ message: 'Enquiry not found' });
      }
      
      // Use deleteOne or findByIdAndDelete
      await Enquiry.findByIdAndDelete(req.params.id);
      
      res.json({ message: 'Enquiry removed' });
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  };
  
  // Update the exports at the bottom
  module.exports = {
    createEnquiry,
    getAllEnquiries,
    deleteEnquiry // <--- Add this
  };