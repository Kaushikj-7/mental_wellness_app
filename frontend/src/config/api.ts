// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  
  // Chat
  CHAT_MESSAGE: `${API_BASE_URL}/api/chat`,
  CHAT_HISTORY: (userId: string) => `${API_BASE_URL}/api/chat/history/${userId}`,
  
  // Appointments
  THERAPISTS: `${API_BASE_URL}/api/therapists`,
  THERAPIST: (id: string) => `${API_BASE_URL}/api/therapists/${id}`,
  APPOINTMENTS: `${API_BASE_URL}/api/appointments`,
  USER_APPOINTMENTS: (userId: string) => `${API_BASE_URL}/api/appointments/user/${userId}`,
  APPOINTMENT_STATUS: (id: string) => `${API_BASE_URL}/api/appointments/${id}/status`,
  
  // Users
  USER_PROFILE: (id: string) => `${API_BASE_URL}/api/users/${id}`,
  
  // Admin
  ADMIN_USERS: `${API_BASE_URL}/api/admin/users`,
  ADMIN_APPOINTMENTS: `${API_BASE_URL}/api/admin/appointments`,
  ADMIN_THERAPISTS: `${API_BASE_URL}/api/admin/therapists`,
  SETUP_ADMIN: `${API_BASE_URL}/api/setup-admin`,
}; 