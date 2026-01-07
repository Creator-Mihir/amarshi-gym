const Member = require('../models/Member');
const Attendance = require('../models/Attendance'); // <--- ADD THIS IMPORT
const jwt = require('jsonwebtoken');
// @desc    Get all members
// @route   GET /api/members
// @access  Private/Admin
// @desc    Get all members with attendance count
// @route   GET /api/members
// @access  Private/Admin
const getMembers = async (req, res) => {
    try {
      // 1. Get all members (use .lean() to make them plain Javascript objects)
      const members = await Member.find().sort({ createdAt: -1 }).lean();
  
      // 2. Loop through each member and count their attendance logs
      const membersWithStats = await Promise.all(members.map(async (member) => {
         const count = await Attendance.countDocuments({ memberId: member._id });
         return { ...member, attendanceCount: count }; // Attach the count
      }));
  
      res.json(membersWithStats);
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  };

// @desc    Add a new member
// @route   POST /api/members
// @access  Private/Admin
const addMember = async (req, res) => {
  try {
    const { name, phone, planName, planPrice, durationInMonths, customStartDate } = req.body;
    
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const startDate = customStartDate ? new Date(customStartDate) : new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + parseInt(durationInMonths));

    // CHECK IF MEMBER EXISTS
    const memberExists = await Member.findOne({ phone });
    if (memberExists) {
      return res.status(400).json({ message: 'Member with this phone already exists' });
    }

    const member = await Member.create({
      name,
      phone,
      password: phone, // <--- DEFAULT PASSWORD IS PHONE NUMBER
      plan: planName,
      price: planPrice,
      image: imagePath,
      startDate,
      endDate,
      status: 'Active'
    });

    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ message: 'Invalid Data' });
  }
};
// @desc    Delete member
// @route   DELETE /api/members/:id
const deleteMember = async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id);
    res.json({ message: 'Member Removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// ... imports

// ADD THIS FUNCTION
const updateMember = async (req, res) => {
  try {
    const { durationInMonths, customStartDate } = req.body;
    let updateData = { ...req.body };

    // 1. CHECK FOR NEW IMAGE FILE
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    // 2. Logic to re-calculate Expiry (Existing Code)
    if (durationInMonths || customStartDate) {
       const oldMember = await Member.findById(req.params.id);
       // Fallback to old start date if not provided in update
       const startDate = customStartDate ? new Date(customStartDate) : new Date(oldMember.startDate);
       const endDate = new Date(startDate);
       
       const duration = durationInMonths ? parseInt(durationInMonths) : 1; 
       endDate.setMonth(endDate.getMonth() + duration);
       
       updateData.startDate = startDate;
       updateData.endDate = endDate;
    }

    const updatedMember = await Member.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedMember);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'Update failed' });
  }
};
  

  const authMember = async (req, res) => {
    const { phone, password } = req.body;
  
    const member = await Member.findOne({ phone });
  
    if (member && (await member.matchPassword(password))) {
      res.json({
        _id: member._id,
        name: member.name,
        phone: member.phone,
        plan: member.plan,
        image: member.image,
        token: generateToken(member._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid Phone or Password' });
    }
  };
  
  // Generate Token Helper
  const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  };
  
  
  const getMemberProfile = async (req, res) => {
    try {
      const member = await Member.findById(req.member._id).select('-password');
      
      // Get Attendance History
      const attendance = await Attendance.find({ memberId: member._id }).sort({ createdAt: -1 });
      
      res.json({
        member,
        attendance
      });
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  };
  
  // Update exports at the bottom!
  module.exports = { 
    getMembers, 
    addMember, 
    deleteMember, 
    updateMember, 
    authMember, 
    getMemberProfile // <--- Add this
  };