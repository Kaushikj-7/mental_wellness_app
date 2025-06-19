
import React, { useState } from 'react';
import { Calendar, Clock, User, MapPin, Video, Phone } from 'lucide-react';

const Appointments: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTherapist, setSelectedTherapist] = useState('');
  const [appointmentType, setAppointmentType] = useState('video');

  const therapists = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Anxiety & Depression', rating: 4.9, avatar: '👩‍⚕️' },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Cognitive Behavioral Therapy', rating: 4.8, avatar: '👨‍⚕️' },
    { id: 3, name: 'Dr. Emily Rodriguez', specialty: 'Trauma & PTSD', rating: 4.9, avatar: '👩‍⚕️' },
    { id: 4, name: 'Dr. David Thompson', specialty: 'Couples Therapy', rating: 4.7, avatar: '👨‍⚕️' }
  ];

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const upcomingAppointments = [
    {
      id: 1,
      therapist: 'Dr. Sarah Johnson',
      date: '2024-06-22',
      time: '10:00 AM',
      type: 'Video Call',
      status: 'Confirmed'
    },
    {
      id: 2,
      therapist: 'Dr. Michael Chen',
      date: '2024-06-25',
      time: '02:00 PM',
      type: 'In-Person',
      status: 'Pending'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Book Your Appointment</h1>
        <p className="text-gray-600">Schedule a session with one of our licensed therapists</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Booking Form */}
        <div className="wellness-card p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Schedule New Appointment</h2>
          
          <div className="space-y-6">
            {/* Therapist Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Select Therapist</label>
              <div className="grid gap-3">
                {therapists.map((therapist) => (
                  <label key={therapist.id} className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                    <input
                      type="radio"
                      name="therapist"
                      value={therapist.id}
                      checked={selectedTherapist === therapist.id.toString()}
                      onChange={(e) => setSelectedTherapist(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`w-full flex items-center space-x-4 ${selectedTherapist === therapist.id.toString() ? 'text-blue-600' : 'text-gray-700'}`}>
                      <div className="text-2xl">{therapist.avatar}</div>
                      <div className="flex-1">
                        <div className="font-medium">{therapist.name}</div>
                        <div className="text-sm text-gray-500">{therapist.specialty}</div>
                        <div className="text-sm text-yellow-600">⭐ {therapist.rating}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Available Times</label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 text-sm rounded-lg border transition-all ${
                      selectedTime === time
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Appointment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Session Type</label>
              <div className="grid grid-cols-3 gap-3">
                <label className="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                  <input
                    type="radio"
                    name="type"
                    value="video"
                    checked={appointmentType === 'video'}
                    onChange={(e) => setAppointmentType(e.target.value)}
                    className="sr-only"
                  />
                  <Video className={`h-6 w-6 mb-2 ${appointmentType === 'video' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className={`text-sm ${appointmentType === 'video' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                    Video Call
                  </span>
                </label>
                <label className="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                  <input
                    type="radio"
                    name="type"
                    value="phone"
                    checked={appointmentType === 'phone'}
                    onChange={(e) => setAppointmentType(e.target.value)}
                    className="sr-only"
                  />
                  <Phone className={`h-6 w-6 mb-2 ${appointmentType === 'phone' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className={`text-sm ${appointmentType === 'phone' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                    Phone Call
                  </span>
                </label>
                <label className="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                  <input
                    type="radio"
                    name="type"
                    value="in-person"
                    checked={appointmentType === 'in-person'}
                    onChange={(e) => setAppointmentType(e.target.value)}
                    className="sr-only"
                  />
                  <MapPin className={`h-6 w-6 mb-2 ${appointmentType === 'in-person' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className={`text-sm ${appointmentType === 'in-person' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                    In-Person
                  </span>
                </label>
              </div>
            </div>

            <button className="w-full wellness-button">
              Book Appointment
            </button>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="wellness-card p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Upcoming Appointments</h2>
          
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-800">{appointment.therapist}</h3>
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    appointment.status === 'Confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(appointment.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{appointment.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {appointment.type === 'Video Call' && <Video className="h-4 w-4" />}
                    {appointment.type === 'In-Person' && <MapPin className="h-4 w-4" />}
                    <span>{appointment.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
