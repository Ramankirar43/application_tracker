const express = require('express');
const { runImmediateCheck } = require('../utils/notificationService');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Manually trigger deadline notifications check (admin only)
router.post('/check-deadlines', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin (you may want to add proper admin check)
    if (!req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized: Admin access required' 
      });
    }
    
    // Run immediate check
    const result = await runImmediateCheck();
    
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: `Deadline check completed successfully. Found ${result.count} upcoming deadlines.`,
        count: result.count
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to check deadlines',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error in manual deadline check:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;