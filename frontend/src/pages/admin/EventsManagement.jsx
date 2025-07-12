import React, { useState, useEffect } from 'react';
import { eventsAPI, teamAPI } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';

const EventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    date: '',
    endDate: '',
    time: '',
    location: '',
    image: '',
    category: 'other',
    status: 'upcoming',
    maxParticipants: '',
    organizers: [],
    tags: [],
    isPublic: true,
    registrationRequired: false,
    registrationDeadline: ''
  });

  const [tagInput, setTagInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchEvents();
    fetchTeamMembers();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAllAdmin();
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await teamAPI.getAll();
      setTeamMembers(response.data);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      shortDescription: '',
      date: '',
      endDate: '',
      time: '',
      location: '',
      image: '',
      category: 'other',
      status: 'upcoming',
      maxParticipants: '',
      organizers: [],
      tags: [],
      isPublic: true,
      registrationRequired: false,
      registrationDeadline: ''
    });
    setTagInput('');
    setImageFile(null);
    setImagePreview('');
    setEditingEvent(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'tags') {
          formDataToSend.append(key, JSON.stringify(formData[key].filter(tag => tag.trim() !== '')));
        } else if (key === 'organizers') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === 'maxParticipants' && formData[key]) {
          formDataToSend.append(key, parseInt(formData[key]));
        } else if (formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add image file if selected
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (editingEvent) {
        await eventsAPI.update(editingEvent._id, formDataToSend);
        setSuccess('Event updated successfully!');
      } else {
        await eventsAPI.create(formDataToSend);
        setSuccess('Event created successfully!');
      }

      fetchEvents();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving event:', error);
      setError(error.response?.data?.message || 'Failed to save event');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      shortDescription: event.shortDescription || '',
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
      endDate: event.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '',
      time: event.time,
      location: event.location,
      image: event.image || '',
      category: event.category,
      status: event.status,
      maxParticipants: event.maxParticipants || '',
      organizers: event.organizers?.map(org => org._id) || [],
      tags: event.tags || [],
      isPublic: event.isPublic,
      registrationRequired: event.registrationRequired,
      registrationDeadline: event.registrationDeadline ? 
        new Date(event.registrationDeadline).toISOString().split('T')[0] : ''
    });
    setImagePreview(event.image || '');
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await eventsAPI.delete(eventId);
      setSuccess('Event deleted successfully!');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      setError('Failed to delete event');
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      setError(''); // Clear any previous errors
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData({ ...formData, image: '' });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue">Events Management</h1>
            <p className="text-gray-400 mt-2">Manage your organization's events</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 font-medium"
          >
            Add New Event
          </button>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Events List */}
        {events.length === 0 ? (
          <div className="text-center py-16 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">No Events Yet</h3>
            <p className="text-gray-400 mb-6">
              Start by creating your first event to engage with your community.
            </p>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all duration-300"
            >
              Create First Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden hover:border-cyan-500 transition-all duration-300"
              >
                {event.image && (
                  <div className="h-32 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.status === 'upcoming' ? 'bg-green-500/20 text-green-400' :
                      event.status === 'ongoing' ? 'bg-yellow-500/20 text-yellow-400' :
                      event.status === 'completed' ? 'bg-gray-500/20 text-gray-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {event.status}
                    </span>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                      {event.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                    {event.title}
                  </h3>

                  <div className="space-y-1 mb-3 text-sm text-gray-400">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                      </svg>
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {event.location}
                    </div>
                  </div>

                  {event.registrationRequired && (
                    <div className="mb-3 text-sm text-gray-400">
                      <span className="font-medium">Registrations: </span>
                      {event.registeredParticipants?.length || 0}
                      {event.maxParticipants && ` / ${event.maxParticipants}`}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(event)}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                      required
                    >
                      <option value="workshop">Workshop</option>
                      <option value="seminar">Seminar</option>
                      <option value="competition">Competition</option>
                      <option value="meeting">Meeting</option>
                      <option value="social">Social</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Status *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                      required
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      End Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Event Image
                    </label>
                    
                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mb-4">
                        <div className="relative inline-block">
                          <img
                            src={imagePreview}
                            alt="Event preview"
                            className="w-full max-w-xs h-32 object-cover rounded-lg border border-gray-600"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* File Upload */}
                    <div className="space-y-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-cyan-600 file:text-white hover:file:bg-cyan-700 transition-colors"
                      />
                      
                      {/* URL Input as fallback */}
                      <div className="text-center text-gray-400 text-sm">or</div>
                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => {
                          setFormData({ ...formData, image: e.target.value });
                          if (e.target.value) {
                            setImagePreview(e.target.value);
                            setImageFile(null);
                          }
                        }}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                        placeholder="Or enter image URL: https://example.com/image.jpg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Max Participants
                    </label>
                    <input
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                      min="1"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                    placeholder="Brief description for event cards"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none h-32 resize-vertical"
                    required
                  />
                </div>

                {/* Organizers */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Organizers
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {teamMembers.map((member) => (
                      <label key={member._id} className="flex items-center space-x-2 text-gray-300">
                        <input
                          type="checkbox"
                          checked={formData.organizers.includes(member._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                organizers: [...formData.organizers, member._id]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                organizers: formData.organizers.filter(id => id !== member._id)
                              });
                            }
                          }}
                          className="rounded border-gray-600 bg-gray-700 text-cyan-500 focus:ring-cyan-500"
                        />
                        <span className="text-sm">{member.name} - {member.role}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                      placeholder="Add a tag"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-red-400 hover:text-red-300"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Registration Settings */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.registrationRequired}
                        onChange={(e) => setFormData({ ...formData, registrationRequired: e.target.checked })}
                        className="rounded border-gray-600 bg-gray-700 text-cyan-500 focus:ring-cyan-500"
                      />
                      <span className="text-gray-300">Registration Required</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.isPublic}
                        onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                        className="rounded border-gray-600 bg-gray-700 text-cyan-500 focus:ring-cyan-500"
                      />
                      <span className="text-gray-300">Public Event</span>
                    </label>
                  </div>

                  {formData.registrationRequired && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Registration Deadline
                      </label>
                      <input
                        type="date"
                        value={formData.registrationDeadline}
                        onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                        className="w-full md:w-auto px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-6 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-3 px-6 rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all duration-300"
                  >
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default EventsManagement;
