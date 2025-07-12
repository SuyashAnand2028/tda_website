import React, { useState, useEffect } from 'react';
import { FaEye, FaTrash, FaCheckCircle, FaTimesCircle, FaClock, FaUser, FaEnvelope, FaGraduationCap, FaCode } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import { formsAPI } from '../../services/api';

const FormsManagement = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchForms();
    fetchStats();
  }, [filter]);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await formsAPI.getAll(params);
      setForms(response.data);
    } catch (error) {
      console.error('Error fetching forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await formsAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await formsAPI.updateStatus(id, { status });
      fetchForms();
      fetchStats();
      setShowModal(false);
      setSelectedForm(null);
    } catch (error) {
      console.error('Error updating form status:', error);
      alert('Error updating form status. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this form submission?')) {
      try {
        await formsAPI.delete(id);
        fetchForms();
        fetchStats();
      } catch (error) {
        console.error('Error deleting form:', error);
        alert('Error deleting form. Please try again.');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-500 bg-green-100';
      case 'rejected': return 'text-red-500 bg-red-100';
      case 'pending': return 'text-yellow-500 bg-yellow-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <FaCheckCircle className="text-green-500" />;
      case 'rejected': return <FaTimesCircle className="text-red-500" />;
      case 'pending': return <FaClock className="text-yellow-500" />;
      default: return <FaClock className="text-gray-500" />;
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Forms Management</h1>
          <div className="mt-4 sm:mt-0">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">All Applications</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FaUser />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <FaClock />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FaCheckCircle />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <FaTimesCircle />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Forms Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Club Applications ({forms.length})
            </h2>
          </div>

          {forms.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl text-gray-400 mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
              <p className="text-gray-500">
                {filter === 'all' 
                  ? 'No club applications have been submitted yet.' 
                  : `No ${filter} applications found.`
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Academic Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Domain
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {forms.map((form) => (
                    <tr key={form._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <FaUser className="text-gray-500" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{form.name}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <FaEnvelope className="mr-1" />
                              {form.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <FaGraduationCap className="mr-2 text-gray-400" />
                          {form.formData?.branch} - {form.formData?.year} Year
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <FaCode className="mr-2 text-gray-400" />
                          {form.formData?.domainOfInterest?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(form.status)}`}>
                          {getStatusIcon(form.status)}
                          <span className="ml-1 capitalize">{form.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(form.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedForm(form);
                              setShowModal(true);
                            }}
                            className="text-cyan-600 hover:text-cyan-900 flex items-center"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleDelete(form._id)}
                            className="text-red-600 hover:text-red-900 flex items-center"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal for viewing form details */}
        {showModal && selectedForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Application Details</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedForm.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedForm.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Branch</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedForm.formData?.branch}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Year</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedForm.formData?.year}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Domain of Interest</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedForm.formData?.domainOfInterest?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                    </div>
                  </div>

                  {selectedForm.message && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Message</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">{selectedForm.message}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Submitted On</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedForm.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedForm.status)}`}>
                      {getStatusIcon(selectedForm.status)}
                      <span className="ml-2 capitalize">{selectedForm.status}</span>
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  {selectedForm.status !== 'approved' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedForm._id, 'approved')}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200 flex items-center justify-center"
                    >
                      <FaCheckCircle className="mr-2" />
                      Approve Application
                    </button>
                  )}
                  {selectedForm.status !== 'rejected' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedForm._id, 'rejected')}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200 flex items-center justify-center"
                    >
                      <FaTimesCircle className="mr-2" />
                      Reject Application
                    </button>
                  )}
                  {selectedForm.status !== 'pending' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedForm._id, 'pending')}
                      className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition duration-200 flex items-center justify-center"
                    >
                      <FaClock className="mr-2" />
                      Mark as Pending
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default FormsManagement;
