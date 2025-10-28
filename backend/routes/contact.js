const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { sendContactFormEmail } = require('../utils/emailService');

// @route   POST /api/contact
// @desc    Send contact form email
// @access  Public
router.post('/', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
], async (req, res) => {
  try {
    console.log('📧 Contact form submission received:', req.body);
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { name, email, message } = req.body;
    console.log('✅ Validation passed, sending email...');

    // For testing without email service
    console.log('📧 Contact form data:', { name, email, message });
    
    // Try to send email to admin
    try {
      const emailResult = await sendContactFormEmail(name, email, message);
      
      if (emailResult) {
        console.log('✅ Contact form email sent successfully');
        res.json({
          success: true,
          message: 'Thank you for your message! We will get back to you soon.'
        });
      } else {
        console.log('❌ Failed to send contact form email');
        res.status(500).json({
          error: 'Failed to send message. Please try again later.'
        });
      }
    } catch (emailError) {
      console.log('❌ Email service error:', emailError.message);
      // For now, return success even if email fails
      res.json({
        success: true,
        message: 'Thank you for your message! We will get back to you soon. (Email service temporarily unavailable)'
      });
    }

  } catch (error) {
    console.error('❌ Contact form error:', error);
    res.status(500).json({
      error: 'Failed to send message. Please try again later.'
    });
  }
});

module.exports = router;
