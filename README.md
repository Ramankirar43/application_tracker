# Job Tracker Application

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for tracking job applications and interviews with real-time updates and email notifications.

## Features

### 🔐 Authentication

- User signup with email verification (OTP)
- JWT-based authentication
- Password hashing with bcrypt
- Secure session management

### 📊 Dashboard

- Overview of all job applications
- Real-time statistics and metrics
- Search and filter functionality
- Pagination for large datasets

### 💼 Job Management

- Add new job applications
- Edit existing applications
- Update application status and rounds
- Delete applications (soft delete)
- Track application dates and follow-ups

### 🔍 Search & Filtering

- Search by company name or job ID
- Filter by application status
- Sort by various criteria

### 📧 Notifications

- Email notifications for status updates
- Welcome emails for new users
- OTP verification emails

### 🎨 Modern UI

- Responsive design with TailwindCSS
- Beautiful and intuitive interface
- Real-time updates with Socket.io
- Toast notifications

## Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **Socket.io** - Real-time updates
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Frontend

- **React.js** - UI library
- **React Router** - Navigation
- **Context API** - State management
- **Axios** - HTTP client
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **Date-fns** - Date utilities
- **Socket.io Client** - Real-time updates

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn package manager

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd job-tracker-app
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file in the `backend` directory:

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/job-tracker

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d

   # Email Configuration (Gmail)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=your-email@gmail.com

   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:3000

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Email Setup (Optional but Recommended)**

   For Gmail:

   - Enable 2-factor authentication
   - Generate an App Password
   - Use the App Password in EMAIL_PASS

5. **Database Setup**

   Make sure MongoDB is running locally or update the MONGODB_URI to point to your cloud database.

## Running the Application

### Development Mode

1. **Start both backend and frontend**

   ```bash
   # From the root directory
   npm run dev
   ```

2. **Or start them separately**

   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

### Production Mode

1. **Build the frontend**

   ```bash
   cd frontend
   npm run build
   ```

2. **Start the backend**
   ```bash
   cd backend
   npm start
   ```

## API Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`

Register a new user with email verification.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "User registered successfully. Please check your email for verification code.",
  "userId": "user_id_here"
}
```

#### POST `/api/auth/verify-otp`

Verify email with OTP code.

**Request Body:**

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response:**

```json
{
  "message": "Email verified successfully!",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "isEmailVerified": true
  }
}
```

#### POST `/api/auth/login`

Authenticate user and get JWT token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "isEmailVerified": true,
    "lastLogin": "2024-01-01T00:00:00.000Z"
  }
}
```

### Job Endpoints

All job endpoints require authentication (Bearer token in Authorization header).

#### GET `/api/jobs`

Get all jobs for the authenticated user with optional filters.

**Query Parameters:**

- `status` - Filter by status
- `search` - Search by company name or job ID
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response:**

```json
{
  "jobs": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalJobs": 50,
    "hasNext": true,
    "hasPrev": false
  },
  "stats": {
    "totalJobs": 50,
    "applied": 20,
    "inProgress": 15,
    "offers": 5,
    "accepted": 3,
    "rejected": 7
  }
}
```

#### POST `/api/jobs`

Create a new job application.

**Request Body:**

```json
{
  "jobId": "JOB-2024-001",
  "companyName": "Google",
  "email": "hr@google.com",
  "status": "applied",
  "roundNumber": 1,
  "position": "Software Engineer",
  "location": "Mountain View, CA",
  "salary": "$120k - $180k",
  "notes": "Applied through LinkedIn",
  "applicationDate": "2024-01-01",
  "nextFollowUp": "2024-01-15"
}
```

#### PUT `/api/jobs/:id`

Update an existing job application.

#### DELETE `/api/jobs/:id`

Delete a job application (soft delete).

#### PATCH `/api/jobs/:id/status`

Update only the status of a job application.

**Request Body:**

```json
{
  "status": "phone-interview",
  "roundNumber": 2
}
```

## Database Schema

### User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  isEmailVerified: Boolean,
  emailVerificationOTP: {
    code: String,
    expiresAt: Date
  },
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Job Model

```javascript
{
  user: ObjectId (ref: User),
  jobId: String,
  companyName: String,
  email: String,
  status: String (enum),
  roundNumber: Number,
  position: String,
  location: String,
  salary: String,
  notes: String,
  applicationDate: Date,
  lastUpdated: Date,
  nextFollowUp: Date,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Deployment

### Backend Deployment (Heroku Example)

1. **Create Heroku app**

   ```bash
   heroku create your-job-tracker-app
   ```

2. **Set environment variables**

   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set EMAIL_USER=your_email
   heroku config:set EMAIL_PASS=your_email_password
   # ... other environment variables
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

### Frontend Deployment (Netlify Example)

1. **Build the application**

   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Set environment variables for API URL

## Security Features

- JWT authentication with expiration
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet security headers
- Email verification
- Soft delete for data integrity

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the GitHub repository.
