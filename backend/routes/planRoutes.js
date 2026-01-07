const express = require('express');
const router = express.Router();
const { getPlans, createPlan,deletePlan,updatePlan } = require('../controllers/planController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Anyone can GET plans
router.get('/', getPlans);

// Only an Admin (Protected) can POST (create) plans
router.post('/', protect, admin, createPlan);
router.delete('/:id', protect, admin, deletePlan); // Admin Only: Delete
router.put('/:id', protect, admin, updatePlan); // <--- Add this
module.exports = router;