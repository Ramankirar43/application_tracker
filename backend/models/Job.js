const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobId: {
    type: String,
    required: [true, 'Job ID is required'],
    trim: true,
    maxlength: [100, 'Job ID cannot be more than 100 characters']
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [200, 'Company name cannot be more than 200 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: [
        'applied',
        'screening',
        'phone-interview',
        'technical-interview',
        'onsite-interview',
        'final-interview',
        'offer',
        'accepted',
        'rejected',
        'withdrawn'
      ],
      message: 'Status must be one of: applied, screening, phone-interview, technical-interview, onsite-interview, final-interview, offer, accepted, rejected, withdrawn'
    },
    default: 'applied'
  },
  roundNumber: {
    type: Number,
    default: 1,
    min: [1, 'Round number must be at least 1']
  },
  position: {
    type: String,
    trim: true,
    maxlength: [200, 'Position cannot be more than 200 characters']
  },
  location: {
    type: String,
    trim: true,
    maxlength: [200, 'Location cannot be more than 200 characters']
  },
  salary: {
    type: String,
    trim: true,
    maxlength: [100, 'Salary cannot be more than 100 characters']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  },
  jobDescription: {
    type: String,
    trim: true,
    maxlength: [2000, 'Job description cannot be more than 2000 characters']
  },
  resume: {
    type: String,
    trim: true,
    maxlength: [500, 'Resume name cannot be more than 500 characters']
  },
  excitementIndex: {
    type: Number,
    min: [1, 'Excitement index must be at least 1'],
    max: [5, 'Excitement index cannot be more than 5'],
    default: 3
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  nextFollowUp: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
jobSchema.index({ user: 1, createdAt: -1 });
jobSchema.index({ user: 1, status: 1 });
jobSchema.index({ user: 1, companyName: 1 });
jobSchema.index({ user: 1, jobId: 1 });
jobSchema.index({ lastUpdated: -1 });

// Pre-save middleware to update lastUpdated
jobSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Instance method to update status and round
jobSchema.methods.updateStatus = function(newStatus, newRound = null) {
  this.status = newStatus;
  if (newRound) {
    this.roundNumber = newRound;
  }
  this.lastUpdated = new Date();
  return this.save();
};

// Static method to get jobs by user with filters
jobSchema.statics.findByUser = function(userId, filters = {}) {
  const query = { user: userId, isActive: true };
  
  if (filters.status) {
    query.status = filters.status;
  }
  
  if (filters.search) {
    const searchRegex = new RegExp(filters.search, 'i');
    query.$or = [
      { companyName: searchRegex },
      { jobId: searchRegex },
      { position: searchRegex }
    ];
  }
  
  return this.find(query).sort({ lastUpdated: -1 });
};

// Static method to get job statistics for a user
jobSchema.statics.getStats = function(userId) {
  return this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), isActive: true } },
    {
      $group: {
        _id: null,
        totalJobs: { $sum: 1 },
        applied: { $sum: { $cond: [{ $eq: ['$status', 'applied'] }, 1, 0] } },
        inProgress: {
          $sum: {
            $cond: [
              { $in: ['$status', ['screening', 'phone-interview', 'technical-interview', 'onsite-interview', 'final-interview']] },
              1,
              0
            ]
          }
        },
        offers: { $sum: { $cond: [{ $eq: ['$status', 'offer'] }, 1, 0] } },
        accepted: { $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] } },
        rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } }
      }
    }
  ]);
};

module.exports = mongoose.model('Job', jobSchema);
