# Analytics Dashboard Feature

## Overview

The Analytics Dashboard provides comprehensive insights into job application performance and trends. It's built using React, TailwindCSS, Recharts, and Framer Motion for a modern, interactive experience.

## Features Implemented

### 1. KPI Summary Cards

- **Total Applications**: Shows the total number of job applications
- **Interviews Scheduled**: Count of applications in interview stages
- **Offers Received**: Number of job offers received
- **Conversion Rate**: Percentage of applications that resulted in offers
- **Upcoming Deadlines**: Number of follow-ups due in the next 7 days

### 2. Interactive Charts

- **Application Status Pie Chart**: Visual breakdown of application statuses (Applied, Interview, Offer, Rejected, etc.)
- **Applications Over Time Line Chart**: Shows application trends over weeks
- **Job Type Distribution Bar Chart**: Distribution by job type (Full-time, Internship, Remote, etc.)
- **Excitement Index Bar Chart**: Distribution of excitement levels for applications

### 3. Deadline & Notification Widget

- Lists jobs with upcoming deadlines in the next 7 days
- Shows days until deadline and company information
- Sorted by urgency

### 4. AI Insights Widget

- **Suggested Focus Areas**: AI-powered recommendations based on application data
- **Resume Success Rate**: Success rates for different resume versions
- **Match Score Trends**: Performance trends over time

## Technical Implementation

### Backend

- **Route**: `/api/analytics` (GET)
- **Authentication**: Protected with JWT middleware
- **Data Processing**: Real-time aggregation of user's job data
- **File**: `backend/routes/analytics.js`

### Frontend

- **Component**: `frontend/src/pages/Analytics.js`
- **Dependencies**:
  - `recharts` for chart visualizations
  - `framer-motion` for animations
  - `@headlessui/react` for UI components
  - `lucide-react` for icons
- **Navigation**: Added to navbar and dashboard

### Data Structure

```javascript
{
  kpis: {
    totalApplications: number,
    interviewsScheduled: number,
    offersReceived: number,
    conversionRatio: number,
    upcomingDeadlines: number
  },
  charts: {
    statusBreakdown: object,
    applicationsOverTime: object,
    jobTypeDistribution: object,
    monthlyTrends: object,
    excitementDistribution: object
  },
  deadlines: array,
  insights: {
    resumeSuccessRate: object,
    matchScoreTrends: object,
    suggestedFocusAreas: array
  }
}
```

## Usage

1. **Access**: Navigate to `/analytics` or click "Analytics" in the navbar
2. **Authentication**: Must be logged in to access
3. **Real-time Data**: Data updates automatically based on current job applications
4. **Responsive Design**: Works on desktop, tablet, and mobile devices

## Installation

The required dependencies have been added to `frontend/package.json`:

```bash
npm install recharts framer-motion @headlessui/react
```

## Future Enhancements

1. **Export Functionality**: PDF/Excel export of analytics data
2. **Custom Date Ranges**: Filter analytics by custom time periods
3. **Advanced Filtering**: Filter by company, location, or job type
4. **Email Reports**: Scheduled email reports of analytics
5. **Goal Setting**: Set application goals and track progress
6. **Comparative Analysis**: Compare performance across different time periods

## Troubleshooting

### Common Issues

1. **Charts Not Loading**: Ensure Recharts is properly installed
2. **No Data Displayed**: Check if user has job applications in the database
3. **Authentication Errors**: Verify JWT token is valid and not expired

### Development

- Backend server must be running on port 5000
- Frontend development server on port 3000
- MongoDB connection required for data retrieval

