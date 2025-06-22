# Deployment Checklist

## ✅ Pre-Deployment

- [ ] Code is in GitHub repository
- [ ] All environment variables documented
- [ ] API keys and secrets ready
- [ ] MongoDB Atlas database created
- [ ] Groq Cloud API key obtained

## 🖥️ Backend (Render)

- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Set root directory to `backend`
- [ ] Configure environment variables:
  - [ ] `MONGO_URI`
  - [ ] `GROQ_API_KEY`
  - [ ] `JWT_SECRET`
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=10000`
- [ ] Deploy and get backend URL
- [ ] Test backend health check: `/api/setup-admin`

## 🌐 Frontend (Vercel)

- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Set root directory to `frontend`
- [ ] Configure environment variables:
  - [ ] `VITE_API_URL` (your Render backend URL)
- [ ] Deploy and get frontend URL

## 🔧 Post-Deployment

- [ ] Create admin user via `/api/setup-admin`
- [ ] Login as admin
- [ ] Add therapist accounts
- [ ] Test user registration
- [ ] Test appointment booking
- [ ] Test AI chatbot
- [ ] Test profile updates

## 🔒 Security

- [ ] Environment variables not in Git
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Database access restricted
- [ ] API keys secured

## 🧪 Testing

- [ ] User registration works
- [ ] User login works
- [ ] Appointment booking works
- [ ] Chatbot responds
- [ ] Profile updates work
- [ ] Admin functions work
- [ ] Mobile responsive

## 📱 Final Steps

- [ ] Update README with live URLs
- [ ] Test on different devices
- [ ] Monitor error logs
- [ ] Set up monitoring (optional)
- [ ] Document admin credentials

---

**Deployment Complete!** 🎉
