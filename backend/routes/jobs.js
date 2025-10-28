const express = require('express');
const { body, validationResult } = require('express-validator');
const Job = require('../models/Job');
const { authenticateToken, checkOwnership } = require('../middleware/auth');
const { sendStatusUpdateEmail } = require('../utils/emailService');

const router = express.Router();

// Validation middleware
const validateJob = [
  body('jobId')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Job ID is required and must be less than 100 characters'),
  body('companyName')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Company name is required and must be less than 200 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('status')
    .optional()
    .isIn(['applied', 'screening', 'phone-interview', 'technical-interview', 'onsite-interview', 'final-interview', 'offer', 'accepted', 'rejected', 'withdrawn'])
    .withMessage('Invalid status'),
  body('roundNumber')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Round number must be at least 1'),
  body('position')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Position must be less than 200 characters'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location must be less than 200 characters'),
  body('salary')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Salary must be less than 100 characters'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes must be less than 1000 characters'),
  body('jobDescription')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Job description must be less than 2000 characters'),
  body('resume')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Resume name must be less than 500 characters'),
  body('excitementIndex')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Excitement index must be between 1 and 5')
];

// @route   GET /api/jobs
// @desc    Get all jobs for the authenticated user with optional filters
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const { status, search, page = 1, limit = 10 } = req.query;

    // Build filters
    const filters = {};
    if (status) filters.status = status;
    if (search) filters.search = search;

    // Get jobs with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const jobs = await Job.findByUser(userId, filters)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalJobs = await Job.countDocuments({ user: userId, isActive: true });

    // Get statistics
    const stats = await Job.getStats(userId);
    const jobStats = stats[0] || {
      totalJobs: 0,
      applied: 0,
      inProgress: 0,
      offers: 0,
      accepted: 0,
      rejected: 0
    };

    res.json({
      jobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalJobs / parseInt(limit)),
        totalJobs,
        hasNext: skip + jobs.length < totalJobs,
        hasPrev: parseInt(page) > 1
      },
      stats: jobStats
    });

  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ 
      error: 'Server error. Please try again.' 
    });
  }
});

// @route   GET /api/jobs/stats
// @desc    Get job statistics for the authenticated user
// @access  Private
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const stats = await Job.getStats(userId);
    
    res.json({
      stats: stats[0] || {
        totalJobs: 0,
        applied: 0,
        inProgress: 0,
        offers: 0,
        accepted: 0,
        rejected: 0
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      error: 'Server error. Please try again.' 
    });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get a specific job by ID
// @access  Private
router.get('/:id', authenticateToken, checkOwnership, async (req, res) => {
  try {
    res.json({ job: req.job });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ 
      error: 'Server error. Please try again.' 
    });
  }
});

// @route   POST /api/jobs
// @desc    Create a new job application
// @access  Private
router.post('/', authenticateToken, validateJob, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array() 
      });
    }

    const userId = req.user._id;
    const {
      jobId,
      companyName,
      email,
      status = 'applied',
      roundNumber = 1,
      position,
      location,
      salary,
      notes,
      jobDescription,
      resume,
      excitementIndex = 3,
      applicationDate,
      nextFollowUp
    } = req.body;

    // Check if job with same ID already exists for this user
    const existingJob = await Job.findOne({ 
      user: userId, 
      jobId, 
      isActive: true 
    });

    if (existingJob) {
      return res.status(400).json({ 
        error: 'A job application with this Job ID already exists' 
      });
    }

    // Create new job
    const job = new Job({
      user: userId,
      jobId,
      companyName,
      email,
      status,
      roundNumber,
      position,
      location,
      salary,
      notes,
      jobDescription,
      resume,
      excitementIndex,
      applicationDate: applicationDate || new Date(),
      nextFollowUp: nextFollowUp ? new Date(nextFollowUp) : null
    });

    await job.save();

    // Emit real-time update via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(`user-${userId}`).emit('job-added', { job });
    }

    res.status(201).json({
      message: 'Job application added successfully',
      job
    });

  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ 
      error: 'Server error. Please try again.' 
    });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update a job application
// @access  Private
router.put('/:id', authenticateToken, checkOwnership, validateJob, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array() 
      });
    }

    const job = req.job;
    const oldStatus = job.status;
    const {
      jobId,
      companyName,
      email,
      status,
      roundNumber,
      position,
      location,
      salary,
      notes,
      jobDescription,
      resume,
      excitementIndex,
      nextFollowUp
    } = req.body;

    // Check if job ID is being changed and if it conflicts with another job
    if (jobId && jobId !== job.jobId) {
      const existingJob = await Job.findOne({ 
        user: req.user._id, 
        jobId, 
        isActive: true,
        _id: { $ne: job._id }
      });

      if (existingJob) {
        return res.status(400).json({ 
          error: 'A job application with this Job ID already exists' 
        });
      }
    }

    // Update job fields
    if (jobId) job.jobId = jobId;
    if (companyName) job.companyName = companyName;
    if (email) job.email = email;
    if (status) job.status = status;
    if (roundNumber) job.roundNumber = roundNumber;
    if (position !== undefined) job.position = position;
    if (location !== undefined) job.location = location;
    if (salary !== undefined) job.salary = salary;
    if (notes !== undefined) job.notes = notes;
    if (jobDescription !== undefined) job.jobDescription = jobDescription;
    if (resume !== undefined) job.resume = resume;
    if (excitementIndex !== undefined) job.excitementIndex = excitementIndex;
    if (nextFollowUp !== undefined) job.nextFollowUp = nextFollowUp ? new Date(nextFollowUp) : null;

    await job.save();

    // Send email notification if status changed
    if (status && status !== oldStatus) {
      await sendStatusUpdateEmail(
        req.user.email,
        req.user.name,
        job,
        oldStatus,
        status
      );
    }

    // Emit real-time update via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(`user-${req.user._id}`).emit('job-updated', { job });
    }

    res.json({
      message: 'Job application updated successfully',
      job
    });

  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ 
      error: 'Server error. Please try again.' 
    });
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job application (soft delete)
// @access  Private
router.delete('/:id', authenticateToken, checkOwnership, async (req, res) => {
  try {
    const job = req.job;
    
    // Soft delete by setting isActive to false
    job.isActive = false;
    await job.save();

    // Emit real-time update via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(`user-${req.user._id}`).emit('job-deleted', { jobId: job._id });
    }

    res.json({
      message: 'Job application deleted successfully'
    });

  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ 
      error: 'Server error. Please try again.' 
    });
  }
});

// @route   PATCH /api/jobs/:id/status
// @desc    Update only the status of a job application
// @access  Private
router.patch('/:id/status', authenticateToken, checkOwnership, [
  body('status')
    .isIn(['applied', 'screening', 'phone-interview', 'technical-interview', 'onsite-interview', 'final-interview', 'offer', 'accepted', 'rejected', 'withdrawn'])
    .withMessage('Invalid status'),
  body('roundNumber')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Round number must be at least 1')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array() 
      });
    }

    const job = req.job;
    const oldStatus = job.status;
    const { status, roundNumber } = req.body;

    // Update status and round number
    await job.updateStatus(status, roundNumber);

    // Send email notification
    await sendStatusUpdateEmail(
      req.user.email,
      req.user.name,
      job,
      oldStatus,
      status
    );

    // Emit real-time update via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(`user-${req.user._id}`).emit('job-status-updated', { job });
    }

    res.json({
      message: 'Job status updated successfully',
      job
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ 
      error: 'Server error. Please try again.' 
    });
  }
});

module.exports = router;
