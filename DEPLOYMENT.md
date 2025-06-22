# Deployment Guide - Wellness Bot Haven

This guide will help you deploy the Wellness Bot Haven application to Vercel (frontend) and Render (backend).

## 🚀 Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Render Account**: Sign up at [render.com](https://render.com)
4. **MongoDB Atlas**: Database setup
5. **Groq Cloud**: API key for AI chatbot

## 📋 Backend Deployment (Render)

### Step 1: Prepare Backend

1. **Environment Variables**: Create a `.env` file in the `backend/` directory:

   ```env
   MONGO_URI=your_mongodb_atlas_connection_string
   GROQ_API_KEY=your_groq_cloud_api_key
   JWT_SECRET=your_jwt_secret_key
   PORT=10000
   NODE_ENV=production
   ```

2. **Verify Files**: Ensure these files exist in `backend/`:
   - `package.json` ✅
   - `index.js` ✅
   - `models.js` ✅
   - `chat.js` ✅
   - `render.yaml` ✅

### Step 2: Deploy to Render

1. **Connect Repository**:

   - Go to [render.com](https://render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**:

   - **Name**: `wellness-bot-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Environment Variables**:

   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `GROQ_API_KEY`: Your Groq Cloud API key
   - `JWT_SECRET`: A secure random string for JWT signing
   - `NODE_ENV`: `production`
   - `PORT`: `10000`

4. **Deploy**: Click "Create Web Service"

5. **Get Backend URL**: Note the URL (e.g., `https://wellness-bot-backend.onrender.com`)

## 🌐 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. **Environment Variables**: Create a `.env.local` file in the `frontend/` directory:

   ```env
   VITE_API_URL=https://your-backend-name.onrender.com
   ```

2. **Verify Files**: Ensure these files exist in `frontend/`:
   - `package.json` ✅
   - `vite.config.ts` ✅
   - `vercel.json` ✅
   - `src/config/api.ts` ✅

### Step 2: Deploy to Vercel

1. **Connect Repository**:

   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project**:

   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Environment Variables**:

   - `VITE_API_URL`: Your Render backend URL

4. **Deploy**: Click "Deploy"

5. **Get Frontend URL**: Note the URL (e.g., `https://wellness-bot-haven.vercel.app`)

## 🔧 Post-Deployment Setup

### Step 1: Create Admin User

1. **Visit Backend URL**: Go to `https://your-backend.onrender.com/api/setup-admin`
2. **Note Credentials**: The response will show admin email and password
3. **Login**: Use these credentials to access the admin dashboard

### Step 2: Add Therapists

1. **Login as Admin**: Use the admin credentials
2. **Add Therapists**: Go to admin dashboard and add therapist accounts
3. **Set Availability**: Configure therapist schedules

### Step 3: Test Application

1. **Register Users**: Create test user accounts
2. **Book Appointments**: Test the appointment booking system
3. **Test Chat**: Verify AI chatbot functionality
4. **Test Profile**: Ensure profile updates work

## 🔒 Security Considerations

### Environment Variables

- ✅ Never commit `.env` files to Git
- ✅ Use strong JWT secrets
- ✅ Keep API keys secure
- ✅ Use HTTPS in production

### CORS Configuration

- ✅ Backend allows frontend domain
- ✅ Proper CORS headers set
- ✅ Secure cookie settings

### Database Security

- ✅ MongoDB Atlas network access configured
- ✅ Database user with minimal privileges
- ✅ Regular backups enabled

## 🐛 Troubleshooting

### Common Issues

1. **Backend Won't Start**:

   - Check environment variables
   - Verify MongoDB connection
   - Check Render logs

2. **Frontend Can't Connect to Backend**:

   - Verify `VITE_API_URL` is correct
   - Check CORS configuration
   - Ensure backend is running

3. **Database Connection Issues**:

   - Verify MongoDB Atlas connection string
   - Check network access settings
   - Ensure database exists

4. **Chatbot Not Working**:
   - Verify Groq API key
   - Check API rate limits
   - Review error logs

### Debug Steps

1. **Check Render Logs**:

   - Go to your Render service
   - Click "Logs" tab
   - Look for error messages

2. **Check Vercel Logs**:

   - Go to your Vercel project
   - Click "Functions" tab
   - Review function logs

3. **Test API Endpoints**:
   - Use Postman or curl
   - Test backend endpoints directly
   - Verify responses

## 📞 Support

If you encounter issues:

1. **Check Documentation**: Review this guide
2. **Review Logs**: Check deployment platform logs
3. **Test Locally**: Ensure app works locally first
4. **Contact Support**: Use platform support channels

## 🔄 Updates

To update your deployed application:

1. **Push Changes**: Commit and push to GitHub
2. **Automatic Deployment**: Vercel and Render will auto-deploy
3. **Verify**: Test the updated application
4. **Rollback**: Use platform rollback features if needed

---

**Note**: Keep your environment variables secure and never expose them in client-side code or public repositories.
