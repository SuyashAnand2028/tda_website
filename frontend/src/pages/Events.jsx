import React, { useState, useEffect } from 'react';
import { eventsAPI } from '../services/api';
import Navbar from '../components/Navbar';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAll();
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') {
      return new Date(event.date) >= new Date() && event.status === 'upcoming';
    }
    if (filter === 'past') {
      return new Date(event.date) < new Date() || event.status === 'completed';
    }
    return event.category === filter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    // If time is already formatted, return as is
    if (timeString.includes('AM') || timeString.includes('PM')) {
      return timeString;
    }
    // Otherwise format from 24-hour format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setRegistrationLoading(true);
    setRegistrationMessage('');

    try {
      await eventsAPI.register(selectedEvent._id, registrationData);
      setRegistrationMessage('Successfully registered for the event!');
      setRegistrationData({ name: '', email: '', phone: '' });
      // Refresh the selected event to show updated participant count
      const response = await eventsAPI.getById(selectedEvent._id);
      setSelectedEvent(response.data);
      fetchEvents(); // Refresh the events list
    } catch (error) {
      setRegistrationMessage(
        error.response?.data?.message || 'Failed to register for the event'
      );
    } finally {
      setRegistrationLoading(false);
    }
  };

  const isEventFull = (event) => {
    return event.maxParticipants && 
           event.registeredParticipants.length >= event.maxParticipants;
  };

  const isRegistrationOpen = (event) => {
    if (!event.registrationRequired) return false;
    if (isEventFull(event)) return false;
    if (event.registrationDeadline) {
      return new Date(event.registrationDeadline) > new Date();
    }
    return new Date(event.date) > new Date();
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-24 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-24">
        <div className="container mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Events
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join us for exciting workshops, seminars, competitions, and networking events. 
              Expand your skills and connect with fellow tech enthusiasts.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { key: 'all', label: 'All Events' },
              { key: 'upcoming', label: 'Upcoming' },
              { key: 'past', label: 'Past Events' },
              { key: 'workshop', label: 'Workshops' },
              { key: 'seminar', label: 'Seminars' },
              { key: 'competition', label: 'Competitions' },
              { key: 'social', label: 'Social' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  filter === key
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 text-center">
              {error}
            </div>
          )}

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-300 mb-2">No Events Found</h3>
              <p className="text-gray-400">
                {filter === 'all' 
                  ? "There are no events available at the moment. Check back soon!"
                  : `No events found for the "${filter}" filter. Try selecting a different filter.`
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden hover:border-cyan-500 transition-all duration-300 group"
                >
                  {/* Event Image */}
                  {event.image && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    {/* Event Header */}
                    <div className="flex items-start justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.status === 'upcoming' ? 'bg-green-500/20 text-green-400' :
                        event.status === 'ongoing' ? 'bg-yellow-500/20 text-yellow-400' :
                        event.status === 'completed' ? 'bg-gray-500/20 text-gray-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-medium">
                        {event.category}
                      </span>
                    </div>

                    {/* Event Details */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {event.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {event.shortDescription || event.description}
                    </p>

                    {/* Date and Time */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-300 text-sm">
                        <svg className="w-4 h-4 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                        </svg>
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center text-gray-300 text-sm">
                        <svg className="w-4 h-4 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatTime(event.time)}
                      </div>
                      <div className="flex items-center text-gray-300 text-sm">
                        <svg className="w-4 h-4 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                      </div>
                    </div>

                    {/* Registration Info */}
                    {event.registrationRequired && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">
                            Participants: {event.registeredParticipants.length}
                            {event.maxParticipants && ` / ${event.maxParticipants}`}
                          </span>
                          {isEventFull(event) && (
                            <span className="text-red-400 font-medium">Full</span>
                          )}
                        </div>
                        {event.maxParticipants && (
                          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                            <div
                              className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.min(
                                  (event.registeredParticipants.length / event.maxParticipants) * 100,
                                  100
                                )}%`
                              }}
                            ></div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-2 px-4 rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 text-sm font-medium"
                      >
                        View Details
                      </button>
                      {isRegistrationOpen(event) && (
                        <button
                          onClick={() => {
                            setSelectedEvent(event);
                            // Auto scroll to registration form when modal opens
                            setTimeout(() => {
                              document.getElementById('registration-form')?.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center'
                              });
                            }, 100);
                          }}
                          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all duration-300 text-sm font-medium"
                        >
                          Register
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">{selectedEvent.title}</h2>
                <button
                  onClick={() => {
                    setSelectedEvent(null);
                    setRegistrationMessage('');
                    setRegistrationData({ name: '', email: '', phone: '' });
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                {/* Event Image */}
                {selectedEvent.image && (
                  <div className="mb-6">
                    <img
                      src={selectedEvent.image}
                      alt={selectedEvent.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Event Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Event Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-300">
                        <svg className="w-5 h-5 mr-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">{formatDate(selectedEvent.date)}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <svg className="w-5 h-5 mr-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{formatTime(selectedEvent.time)}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <svg className="w-5 h-5 mr-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{selectedEvent.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          selectedEvent.status === 'upcoming' ? 'bg-green-500/20 text-green-400' :
                          selectedEvent.status === 'ongoing' ? 'bg-yellow-500/20 text-yellow-400' :
                          selectedEvent.status === 'completed' ? 'bg-gray-500/20 text-gray-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1)}
                        </span>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium">
                          {selectedEvent.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedEvent.registrationRequired && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Registration Info</h3>
                      <div className="space-y-3">
                        <div className="text-gray-300">
                          <span className="font-medium">Registered: </span>
                          {selectedEvent.registeredParticipants.length}
                          {selectedEvent.maxParticipants && ` / ${selectedEvent.maxParticipants}`}
                        </div>
                        {selectedEvent.maxParticipants && (
                          <div className="w-full bg-gray-700 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-cyan-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.min(
                                  (selectedEvent.registeredParticipants.length / selectedEvent.maxParticipants) * 100,
                                  100
                                )}%`
                              }}
                            ></div>
                          </div>
                        )}
                        {selectedEvent.registrationDeadline && (
                          <div className="text-gray-300">
                            <span className="font-medium">Registration Deadline: </span>
                            {formatDate(selectedEvent.registrationDeadline)}
                          </div>
                        )}
                        <div className={`text-sm font-medium ${
                          isRegistrationOpen(selectedEvent) ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {isRegistrationOpen(selectedEvent) ? 'Registration Open' : 
                           isEventFull(selectedEvent) ? 'Event Full' : 'Registration Closed'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Event Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Description</h3>
                  <div className="text-gray-300 whitespace-pre-wrap">
                    {selectedEvent.description}
                  </div>
                </div>

                {/* Tags */}
                {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Organizers */}
                {selectedEvent.organizers && selectedEvent.organizers.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Organizers</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedEvent.organizers.map((organizer) => (
                        <div key={organizer._id} className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                            {organizer.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-white font-medium">{organizer.name}</div>
                            <div className="text-gray-400 text-sm">{organizer.role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Registration Form */}
                {isRegistrationOpen(selectedEvent) && (
                  <div id="registration-form" className="bg-gray-700/50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Register for this Event</h3>
                    
                    {registrationMessage && (
                      <div className={`mb-4 p-3 rounded-lg ${
                        registrationMessage.includes('Successfully') 
                          ? 'bg-green-500/20 border border-green-500 text-green-300'
                          : 'bg-red-500/20 border border-red-500 text-red-300'
                      }`}>
                        {registrationMessage}
                      </div>
                    )}

                    <form onSubmit={handleRegistration} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={registrationData.name}
                          onChange={(e) => setRegistrationData({
                            ...registrationData,
                            name: e.target.value
                          })}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={registrationData.email}
                          onChange={(e) => setRegistrationData({
                            ...registrationData,
                            email: e.target.value
                          })}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={registrationData.phone}
                          onChange={(e) => setRegistrationData({
                            ...registrationData,
                            phone: e.target.value
                          })}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={registrationLoading}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {registrationLoading ? 'Registering...' : 'Register for Event'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Events;
