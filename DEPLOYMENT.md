# Deployment Guide

This application is deployed with:
- Frontend: Vercel (https://application-trackerraman-ramankirar43s-projects.vercel.app/)
- Backend: Render (https://application-tracker-ramank.onrender.com)

## Backend Deployment (Render)

1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Configure the following settings:
   - Name: application-tracker-backend
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Set the following environment variables:
     - `NODE_ENV`: production
     - `PORT`: 10000
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret
     - `FRONTEND_URL`: https://application-trackerraman-ramankirar43s-projects.vercel.app

## Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Create a new project on Vercel
3. Connect your GitHub repository
4. Configure the following settings:
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: build
   - Set the following environment variables:
     - `REACT_APP_API_URL`: https://application-tracker-ramank.onrender.com
     - `REACT_APP_SOCKET_URL`: https://application-tracker-ramank.onrender.com

## Local Development

1. Backend:
   - Create a `.env` file in the backend directory with the variables from `.env.example`
   - Run `npm install` and `npm start`

2. Frontend:
   - Create a `.env.development` file with local environment variables
   - Run `npm install` and `npm start`