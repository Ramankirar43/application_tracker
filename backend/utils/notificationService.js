const schedule = require('node-schedule');
const User = require('../models/User');
const Job = require('../models/Job');
const { sendDeadlineReminderEmail } = require('./emailService');

// Check for upcoming deadlines and send notifications ONLY for deadlines exactly 24 hours away
const checkUpcomingDeadlines = async () => {
  try {
    console.log('🔍 Checking for deadlines exactly 24 hours away...');
    
    // Get current date and time
    const now = new Date();
    
    // Calculate exactly 24 hours from now
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    // Calculate a small window (1 hour) to catch deadlines that are exactly 24 hours away
    const windowStart = new Date(twentyFourHoursFromNow.getTime() - 30 * 60 * 1000); // 23.5 hours from now
    const windowEnd = new Date(twentyFourHoursFromNow.getTime() + 30 * 60 * 1000);   // 24.5 hours from now
    
    console.log(`Looking for deadlines between ${windowStart.toISOString()} and ${windowEnd.toISOString()}`);
    
    // Find all jobs with follow-up dates exactly 24 hours from now (with a small window)
    const jobs = await Job.find({
      nextFollowUp: {
        $gte: windowStart,
        $lt: windowEnd
      },
      isActive: true
    }).populate('user', 'email name');
    
    console.log(`📅 Found ${jobs.length} jobs with upcoming follow-ups`);
    
    // Send notifications for each job
    for (const job of jobs) {
      if (job.user && job.user.email) {
        await sendDeadlineReminderEmail(
          job.user.email,
          job.user.name,
          {
            companyName: job.companyName,
            jobId: job.jobId,
            position: job.position,
            status: job.status,
            nextFollowUp: job.nextFollowUp,
            notes: job.notes
          }
        );
        console.log(`📧 Sent reminder for job: ${job.companyName} to ${job.user.email}`);
      }
    }
    
    return {
      success: true,
      count: jobs.length
    };
  } catch (error) {
    console.error('❌ Error checking upcoming deadlines:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Schedule the job to run daily at 9:00 AM
const scheduleDeadlineChecks = () => {
  // Run every day at 9:00 AM
  const job = schedule.scheduleJob('59 16 * * *', async () => {
    console.log('⏰ Running scheduled deadline check...');
    await checkUpcomingDeadlines();
  });
  
  console.log('🗓️ Deadline notification scheduler initialized');
  return job;
};

// Run an immediate check (useful for testing or manual triggers)
const runImmediateCheck = async () => {
  console.log('🔄 Running immediate deadline check...');
  return await checkUpcomingDeadlines();
};

module.exports = {
  scheduleDeadlineChecks,
  runImmediateCheck
};