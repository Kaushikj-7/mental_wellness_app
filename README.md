# Wellness Bot Haven - Mental Wellness Application

A full-stack mental wellness application with AI-powered chatbot, appointment booking, and user management system.

## 🚀 Features

### Core Features

- **AI-Powered Chatbot**: Intelligent mental health support using Groq Cloud's Llama-3 model
- **User Authentication**: Secure registration and login system
- **Appointment Booking**: Schedule sessions with therapists
- **User Profiles**: Manage personal information and preferences
- **Chat History**: Persistent conversation history for users and admin review
- **Admin Dashboard**: Monitor users, appointments, and chat interactions
- **Therapist Management**: Browse and book sessions with available therapists

### Technical Features

- **Real-time Chat**: Instant messaging with AI chatbot
- **Responsive Design**: Mobile-friendly interface using Bootstrap 5
- **Secure API**: RESTful backend with JWT authentication
- **Database Integration**: MongoDB Atlas for data persistence
- **Error Handling**: Comprehensive error logging and user feedback

## 🛠️ Technologies Used

### Frontend

- **React 18** - Modern UI framework
- **TypeScript** - Type-safe JavaScript
- **Bootstrap 5** - Responsive CSS framework
- **Axios** - HTTP client for API calls
- **Vite** - Fast build tool and dev server

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Groq Cloud API** - AI chatbot integration (Llama-3 model)

### Database

- **MongoDB Atlas** - Cloud database service

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **MongoDB Atlas** account and connection string
- **Groq Cloud** API key

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd wellness-bot-haven-main
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the backend directory:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
GROQ_API_KEY=your_groq_cloud_api_key
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Start the backend server:

```bash
npm start
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
wellness-bot-haven-main/
├── backend/
│   ├── chat.js              # Chatbot API endpoints
│   ├── index.js             # Main server file
│   ├── models.js            # MongoDB schemas
│   └── package.json         # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   └── main.tsx        # App entry point
│   ├── package.json        # Frontend dependencies
│   └── vite.config.ts      # Vite configuration
└── README.md               # This file
```

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Chat

- `POST /api/chat/message` - Send message to chatbot
- `GET /api/chat/history/:userId` - Get user's chat history

### Appointments

- `GET /api/therapists` - Get available therapists
- `POST /api/appointments` - Book new appointment
- `GET /api/appointments/:userId` - Get user's appointments

## 🎯 Usage

### For Users

1. **Register/Login**: Create an account or sign in
2. **Chat with AI**: Access the chatbot for mental health support
3. **Book Appointments**: Schedule sessions with therapists
4. **View Profile**: Manage personal information
5. **View History**: Review past conversations and appointments

### For Admins

1. **Dashboard**: Monitor system activity
2. **User Management**: View and manage user accounts
3. **Chat Review**: Review user conversations
4. **Appointment Oversight**: Monitor booking activity

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Encrypted password storage
- **Input Validation**: Server-side data validation
- **CORS Protection**: Cross-origin request security
- **Environment Variables**: Secure configuration management

## 🐛 Troubleshooting

### Common Issues

1. **Backend Connection Error**

   - Verify MongoDB Atlas connection string
   - Check if backend server is running on port 5000

2. **Frontend Build Errors**

   - Clear node_modules and reinstall dependencies
   - Ensure Node.js version is 16 or higher

3. **Chatbot Not Responding**

   - Verify Groq API key is valid
   - Check API rate limits and quotas

4. **Database Connection Issues**
   - Ensure MongoDB Atlas cluster is active
   - Verify network access and IP whitelist

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:

- Create an issue in the repository
- Contact the development team

## 🔄 Updates

Stay updated with the latest features and improvements by regularly pulling from the main branch.

---

**Note**: This application is for educational and demonstration purposes. For production use, ensure proper security measures, data protection compliance, and professional mental health consultation integration.
