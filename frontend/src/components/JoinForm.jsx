import React, { useState } from 'react';
import { formsAPI } from '../services/api';

const JoinForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    branch: '',
    year: '',
    domainOfInterest: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await formsAPI.submit({
        ...formData,
        type: 'club_application',
        status: 'pending'
      });
      
      setSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        branch: '',
        year: '',
        domainOfInterest: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section id="join" className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-green-500/20 border border-green-500 rounded-lg p-8">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold mb-4 text-green-400">Application Submitted!</h2>
            <p className="text-gray-300 mb-6">
              Thank you for your interest in joining TDA! We've received your application 
              and will review it shortly. You'll hear back from us soon.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="bg-cyan-500 hover:bg-cyan-600 transition text-white font-semibold py-2 px-6 rounded"
            >
              Submit Another Application
            </button>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section id="join" className="bg-gray-900 text-white py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-cyan-400">Join Our Club</h2>
        <p className="text-center text-gray-400 mb-10">
          Interested in design, development, or tech? Fill out the form below to apply!
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 text-red-400 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
              placeholder="Enter Your Full Name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
              placeholder="you@example.com"
            />
          </div>

          {/* Branch */}
          <div>
            <label className="block text-sm mb-1">Branch</label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
              placeholder="CSE, ECE, etc."
            />
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm mb-1">Year</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
            >
              <option value="">Select Year</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
            </select>
          </div>

          {/* Domain of Interest */}
          <div>
            <label className="block text-sm mb-1">Domain of Interest</label>
            <select
              name="domainOfInterest"
              value={formData.domainOfInterest}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
            >
              <option value="">Choose a domain</option>
              <option value="web-development">Web Development</option>
              <option value="app-development">App Development</option>
              <option value="data-analytics-ml">Data Analytics And Machine Learning</option>
              <option value="deep-learning">Deep Learning</option>
              <option value="dsa">Data Structures & Algorithms</option>
            </select>
          </div>

          {/* Additional Message */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm mb-1">Tell us about yourself (Optional)</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              disabled={loading}
              rows="3"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
              placeholder="Why do you want to join TDA? What are your interests and goals?"
            />
          </div>

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2 text-center mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-cyan-500 hover:bg-cyan-600 transition text-white font-semibold py-2 px-6 rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                'Apply Now'
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default JoinForm;
