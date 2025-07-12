import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import { teamAPI } from '../../services/api';

const TeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    image: '',
    imageFile: null,
    quote: '',
    socialMedia: {
      github: '',
      linkedin: '',
      instagram: '',
      twitter: ''
    },
    email: '',
    phone: '',
    bio: '',
    skills: [],
    isActive: true
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await teamAPI.getAll();
      setTeamMembers(response.data);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      
      // Add all form fields to FormData
      submitData.append('name', formData.name);
      submitData.append('role', formData.role);
      submitData.append('quote', formData.quote);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('bio', formData.bio);
      submitData.append('isActive', formData.isActive);
      
      // Add social media as JSON string
      submitData.append('socialMedia', JSON.stringify(formData.socialMedia));
      
      // Add skills as comma-separated string
      submitData.append('skills', formData.skills.join(','));
      
      // Add image file if selected, otherwise keep existing image URL
      if (formData.imageFile) {
        submitData.append('image', formData.imageFile);
      } else if (formData.image && !editingMember) {
        // For new members without file, this shouldn't happen as we require file
        alert('Please select an image file');
        return;
      }
      
      if (editingMember) {
        await teamAPI.update(editingMember._id, submitData);
      } else {
        await teamAPI.create(submitData);
      }
      
      setShowModal(false);
      setEditingMember(null);
      resetForm();
      fetchTeamMembers();
    } catch (error) {
      console.error('Error saving team member:', error);
      alert('Error saving team member. Please try again.');
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      ...member,
      skills: member.skills || [],
      imageFile: null
    });
    setImagePreview(member.image);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await teamAPI.delete(id);
        fetchTeamMembers();
      } catch (error) {
        console.error('Error deleting team member:', error);
        alert('Error deleting team member. Please try again.');
      }
    }
  };

  const toggleActive = async (id) => {
    try {
      await teamAPI.toggleActive(id);
      fetchTeamMembers();
    } catch (error) {
      console.error('Error toggling team member status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      image: '',
      imageFile: null,
      quote: '',
      socialMedia: {
        github: '',
        linkedin: '',
        instagram: '',
        twitter: ''
      },
      email: '',
      phone: '',
      bio: '',
      skills: [],
      isActive: true
    });
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('socialMedia.')) {
      const socialField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [socialField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setFormData(prev => ({
      ...prev,
      skills
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        imageFile: file
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
            <p className="text-gray-600">Manage your team members</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
          >
            <FaPlus />
            Add Team Member
          </button>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div key={member._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-cyan-600">{member.role}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {member.isActive ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Inactive</span>
                    )}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 italic">"{member.quote}"</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => toggleActive(member._id)}
                    className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors duration-200"
                    title={member.isActive ? "Deactivate" : "Activate"}
                  >
                    {member.isActive ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <button
                    onClick={() => handleDelete(member._id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(member.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {editingMember ? 'Edit Team Member' : 'Add Team Member'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      required={!editingMember}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                    />
                    {imagePreview && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">Preview:</p>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                        />
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      Choose an image file (JPG, PNG, etc.) up to 5MB. Image will be automatically resized to 400x400 pixels.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quote</label>
                  <textarea
                    name="quote"
                    value={formData.quote}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                    <input
                      type="url"
                      name="socialMedia.github"
                      value={formData.socialMedia.github}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                    <input
                      type="url"
                      name="socialMedia.linkedin"
                      value={formData.socialMedia.linkedin}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                    <input
                      type="url"
                      name="socialMedia.instagram"
                      value={formData.socialMedia.instagram}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                    <input
                      type="url"
                      name="socialMedia.twitter"
                      value={formData.socialMedia.twitter}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.skills.join(', ')}
                    onChange={handleSkillsChange}
                    placeholder="React, Node.js, Design, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div className="flex items-center justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingMember(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors duration-200"
                  >
                    {editingMember ? 'Update' : 'Create'}
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

export default TeamManagement;
