import React, { useState, useEffect } from 'react';
import { newsAPI, teamAPI } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    image: '',
    category: 'general',
    tags: [],
    status: 'draft',
    publishDate: new Date().toISOString().split('T')[0],
    featured: false
  });

  const [tagInput, setTagInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchNews();
    fetchTeamMembers();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await newsAPI.getAllAdmin();
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Failed to load news');
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
      content: '',
      excerpt: '',
      author: '',
      image: '',
      category: 'general',
      tags: [],
      status: 'draft',
      publishDate: new Date().toISOString().split('T')[0],
      featured: false
    });
    setTagInput('');
    setImageFile(null);
    setImagePreview('');
    setEditingNews(null);
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
        } else if (formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add image file if selected
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (editingNews) {
        await newsAPI.update(editingNews._id, formDataToSend);
        setSuccess('News article updated successfully!');
      } else {
        await newsAPI.create(formDataToSend);
        setSuccess('News article created successfully!');
      }

      fetchNews();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving news:', error);
      setError(error.response?.data?.message || 'Failed to save news article');
    }
  };

  const handleEdit = (article) => {
    setEditingNews(article);
    setFormData({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt || '',
      author: article.author?._id || '',
      image: article.image || '',
      category: article.category,
      tags: article.tags || [],
      status: article.status,
      publishDate: article.publishDate ? 
        new Date(article.publishDate).toISOString().split('T')[0] : 
        new Date().toISOString().split('T')[0],
      featured: article.featured
    });
    setImagePreview(article.image || '');
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (articleId) => {
    if (!window.confirm('Are you sure you want to delete this news article?')) return;

    try {
      await newsAPI.delete(articleId);
      setSuccess('News article deleted successfully!');
      fetchNews();
    } catch (error) {
      console.error('Error deleting news:', error);
      setError('Failed to delete news article');
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-500/20 text-green-400';
      case 'draft': return 'bg-yellow-500/20 text-yellow-400';
      case 'archived': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">News Management</h1>
            <p className="text-gray-400 mt-2">Create and manage news articles and announcements</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 font-medium"
          >
            Add New Article
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

        {/* News Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Total Articles</p>
                <p className="text-2xl font-bold text-white">{news.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Published</p>
                <p className="text-2xl font-bold text-white">
                  {news.filter(article => article.status === 'published').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Drafts</p>
                <p className="text-2xl font-bold text-white">
                  {news.filter(article => article.status === 'draft').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Featured</p>
                <p className="text-2xl font-bold text-white">
                  {news.filter(article => article.featured).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* News List */}
        {news.length === 0 ? (
          <div className="text-center py-16 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">No News Articles Yet</h3>
            <p className="text-gray-400 mb-6">
              Start by creating your first news article to share updates with your community.
            </p>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all duration-300"
            >
              Create First Article
            </button>
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Article</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Author</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Stats</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {news.map((article) => (
                    <tr key={article._id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {article.image && (
                            <img
                              src={article.image}
                              alt={article.title}
                              className="w-12 h-12 rounded-lg object-cover mr-4"
                            />
                          )}
                          <div>
                            <div className="flex items-center">
                              <h3 className="text-white font-medium line-clamp-1">
                                {article.title}
                              </h3>
                              {article.featured && (
                                <span className="ml-2 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                                  Featured
                                </span>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm line-clamp-1">
                              {article.excerpt || article.content.substring(0, 60) + '...'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {article.author?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-sm">
                          {article.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(article.status)}`}>
                          {article.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">
                        {formatDate(article.publishDate)}
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">
                        <div className="space-y-1">
                          <div>{article.views || 0} views</div>
                          <div>{article.likes || 0} likes</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(article)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(article._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {editingNews ? 'Edit Article' : 'Add New Article'}
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
                      Title *
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
                      <option value="announcement">Announcement</option>
                      <option value="achievement">Achievement</option>
                      <option value="event">Event</option>
                      <option value="project">Project</option>
                      <option value="general">General</option>
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
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Author
                    </label>
                    <select
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="">Select Author</option>
                      {teamMembers.map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.name} - {member.role}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Publish Date
                    </label>
                    <input
                      type="date"
                      value={formData.publishDate}
                      onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Article Image
                    </label>
                    
                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mb-4">
                        <div className="relative inline-block">
                          <img
                            src={imagePreview}
                            alt="Article preview"
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
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Excerpt (Optional)
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none h-20 resize-vertical"
                    placeholder="Brief summary of the article"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Content *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none h-40 resize-vertical"
                    required
                  />
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

                {/* Settings */}
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded border-gray-600 bg-gray-700 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span className="text-gray-300">Featured Article</span>
                  </label>
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
                    {editingNews ? 'Update Article' : 'Create Article'}
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

export default NewsManagement;
