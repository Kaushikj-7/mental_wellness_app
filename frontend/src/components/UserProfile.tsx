
import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Edit3, Save, Shield } from 'lucide-react';

const UserProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-05-15',
    address: '123 Main St, New York, NY 10001',
    emergencyContact: 'Jane Doe - (555) 987-6543',
    insurance: 'Blue Cross Blue Shield',
    preferredTherapist: 'Dr. Sarah Johnson'
  });

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
    console.log('Profile saved:', profile);
  };

  const sessions = [
    { date: '2024-06-15', therapist: 'Dr. Sarah Johnson', type: 'Video Call', status: 'Completed' },
    { date: '2024-06-08', therapist: 'Dr. Sarah Johnson', type: 'Video Call', status: 'Completed' },
    { date: '2024-06-01', therapist: 'Dr. Michael Chen', type: 'In-Person', status: 'Completed' },
    { date: '2024-05-25', therapist: 'Dr. Sarah Johnson', type: 'Phone Call', status: 'Completed' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Your Profile</h1>
        <p className="text-gray-600">Manage your personal information and session history</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 wellness-card p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Personal Information</h2>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </>
              ) : (
                <>
                  <Edit3 className="h-4 w-4" />
                  <span>Edit</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <User className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-800">{profile.name}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-800">{profile.email}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-800">{profile.phone}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-800">{new Date(profile.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              {isEditing ? (
                <textarea
                  value={profile.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={2}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-800">{profile.address}</span>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-800">{profile.emergencyContact}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Provider</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.insurance}
                    onChange={(e) => handleInputChange('insurance', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Shield className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-800">{profile.insurance}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Session History */}
        <div className="wellness-card p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Session History</h2>
          
          <div className="space-y-4">
            {sessions.map((session, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-800">
                    {new Date(session.date).toLocaleDateString()}
                  </div>
                  <div className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    {session.status}
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-1">{session.therapist}</div>
                <div className="text-xs text-gray-500">{session.type}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Total Sessions</h3>
            <div className="text-2xl font-bold text-blue-600">{sessions.length}</div>
            <div className="text-sm text-blue-600">Completed sessions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
