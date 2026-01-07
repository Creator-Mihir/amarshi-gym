const Plan = require('../models/Plan');

// @desc    Get all plans
// @route   GET /api/plans
// @access  Public
const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new plan
// @route   POST /api/plans
// @access  Private/Admin
const createPlan = async (req, res) => {
  try {
    const { name, price, features, durationInMonths } = req.body;
    
    // Create the plan
    const plan = await Plan.create({
      name,
      price,
      features, // Expecting an array of strings
      durationInMonths
    });

    res.status(201).json(plan);
  } catch (error) {
    res.status(400).json({ message: 'Invalid Data' });
  }
};

// @desc    Delete a plan
// @route   DELETE /api/plans/:id
// @access  Private/Admin
const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    await Plan.findByIdAndDelete(req.params.id);
    res.json({ message: 'Plan Removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// ... existing imports

// ADD THIS FUNCTION
const updatePlan = async (req, res) => {
    try {
      const updatedPlan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedPlan);
    } catch (error) {
      res.status(400).json({ message: 'Update failed' });
    }
  };
  
  // Update exports
  module.exports = { getPlans, createPlan, deletePlan, updatePlan };