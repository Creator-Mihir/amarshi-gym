const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { getMembers, addMember, deleteMember,updateMember, authMember, getMemberProfile } = require('../controllers/memberController');
const { protect, admin } = require('../middlewares/authMiddleware');
const { protectMember } = require('../middlewares/memberMiddleware');
router.get('/', protect, admin, getMembers);
router.post('/', protect, admin, addMember);
router.delete('/:id', protect, admin, deleteMember);
router.post('/login', authMember); // <--- NEW PUBLIC ROUTE
router.get('/profile', protectMember, getMemberProfile); // <--- NEW ROUTE
router.put('/:id', protect, admin, upload.single('image'), updateMember);
module.exports = router;