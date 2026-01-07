const express = require('express');
const router = express.Router();
const { createEnquiry, getAllEnquiries,deleteEnquiry } = require('../controllers/enquiryController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.post('/', createEnquiry);                 // Public: Visitors send message
router.get('/', protect, admin, getAllEnquiries); // Admin: Reads messages
router.delete('/:id', protect, admin, deleteEnquiry); // <--- Add this line

module.exports = router;