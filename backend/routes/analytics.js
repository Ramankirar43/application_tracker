const express = require('express');
const { body, validationResult } = require('express-validator');
const Job = require('../models/Job');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get analytics data for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all jobs for the user
    const jobs = await Job.find({ user: userId, isActive: true }).sort({ applicationDate: -1 });
    
    // Calculate KPIs
    const totalApplications = jobs.length;
    const interviewsScheduled = jobs.filter(job => 
      ['interview', 'interview_scheduled', 'interview_completed'].includes(job.status)
    ).length;
    const offersReceived = jobs.filter(job => job.status === 'offer').length;
    const conversionRatio = totalApplications > 0 ? ((offersReceived / totalApplications) * 100).toFixed(1) : 0;
    
    // Calculate upcoming deadlines (next 7 days)
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
    const upcomingDeadlines = jobs.filter(job => 
      job.nextFollowUp && 
      job.nextFollowUp >= now && 
      job.nextFollowUp <= sevenDaysFromNow
    ).length;

    // Status breakdown for pie chart
    const statusBreakdown = jobs.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    }, {});

    // Applications over time (per week) for line chart
    const applicationsOverTime = jobs.reduce((acc, job) => {
      const weekStart = new Date(job.applicationDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);
      
      const weekKey = weekStart.toISOString().split('T')[0];
      acc[weekKey] = (acc[weekKey] || 0) + 1;
      return acc;
    }, {});

    // Job type distribution (based on position field) for bar chart
    const jobTypeDistribution = jobs.reduce((acc, job) => {
      const jobType = job.position ? 
        (job.position.toLowerCase().includes('intern') ? 'Internship' :
         job.position.toLowerCase().includes('remote') ? 'Remote' :
         job.position.toLowerCase().includes('full') ? 'Full-time' :
         job.position.toLowerCase().includes('part') ? 'Part-time' :
         job.position.toLowerCase().includes('contract') ? 'Contract' : 'Other') : 'Other';
      
      acc[jobType] = (acc[jobType] || 0) + 1;
      return acc;
    }, {});

    // Upcoming deadlines with job details
    const deadlineJobs = jobs.filter(job => 
      job.nextFollowUp && 
      job.nextFollowUp >= now && 
      job.nextFollowUp <= sevenDaysFromNow
    ).map(job => ({
      id: job._id,
      jobId: job.jobId,
      companyName: job.companyName,
      position: job.position,
      nextFollowUp: job.nextFollowUp,
      status: job.status,
      daysUntil: Math.ceil((job.nextFollowUp - now) / (1000 * 60 * 60 * 24))
    })).sort((a, b) => a.nextFollowUp - b.nextFollowUp);

    // Monthly trends for the last 6 months
    const monthlyTrends = {};
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    jobs.filter(job => job.applicationDate >= sixMonthsAgo).forEach(job => {
      const monthKey = job.applicationDate.toISOString().substring(0, 7); // YYYY-MM format
      monthlyTrends[monthKey] = (monthlyTrends[monthKey] || 0) + 1;
    });

    // Excitement index distribution
    const excitementDistribution = jobs.reduce((acc, job) => {
      const index = job.excitementIndex || 3;
      acc[index] = (acc[index] || 0) + 1;
      return acc;
    }, {});

    // Resume version success rate (mock data for now)
    const resumeSuccessRate = {
      'Resume_v1.pdf': 25,
      'Resume_v2.pdf': 35,
      'Resume_v3.pdf': 45
    };

    // Match score trends (mock data for now)
    const matchScoreTrends = {
      'Last Week': 75,
      'This Week': 82,
      'Next Week': 78
    };

    // Suggested focus areas based on data
    const suggestedFocusAreas = [];
    if (conversionRatio < 10) {
      suggestedFocusAreas.push('Improve interview preparation');
    }
    if (upcomingDeadlines > 5) {
      suggestedFocusAreas.push('Prioritize follow-ups');
    }
    if (Object.keys(statusBreakdown).includes('rejected') && statusBreakdown.rejected > totalApplications * 0.5) {
      suggestedFocusAreas.push('Review application strategy');
    }

    res.json({
      kpis: {
        totalApplications,
        interviewsScheduled,
        offersReceived,
        conversionRatio: parseFloat(conversionRatio),
        upcomingDeadlines
      },
      charts: {
        statusBreakdown,
        applicationsOverTime,
        jobTypeDistribution,
        monthlyTrends,
        excitementDistribution
      },
      deadlines: deadlineJobs,
      insights: {
        resumeSuccessRate,
        matchScoreTrends,
        suggestedFocusAreas
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

module.exports = router;

