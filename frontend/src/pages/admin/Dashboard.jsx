import React, { useState, useEffect } from 'react';
import { FaUsers, FaCalendarAlt, FaNewspaper, FaWpforms, FaChartLine, FaEye } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import { teamAPI, eventsAPI, newsAPI, formsAPI } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    teamMembers: 0,
    events: 0,
    news: 0,
    formSubmissions: 0,
    pendingForms: 0,
    upcomingEvents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all stats in parallel
      const [teamRes, eventsRes, newsRes, formsStatsRes] = await Promise.all([
        teamAPI.getAll(),
        eventsAPI.getAllAdmin(),
        newsAPI.getAllAdmin(),
        formsAPI.getStats(),
      ]);

      const now = new Date();
      const upcomingEvents = eventsRes.data.filter(event => new Date(event.date) > now);
      const pendingForms = formsStatsRes.data.pending || 0;

      setStats({
        teamMembers: teamRes.data.length,
        events: eventsRes.data.length,
        news: newsRes.data.length,
        formSubmissions: formsStatsRes.data.total || 0,
        pendingForms,
        upcomingEvents: upcomingEvents.length,
      });

      // Create recent activity from various sources
      const activity = [
        ...eventsRes.data.slice(0, 3).map(event => ({
          type: 'event',
          title: `Event: ${event.title}`,
          time: event.createdAt,
          icon: <FaCalendarAlt className="text-blue-500" />,
        })),
        ...newsRes.data.slice(0, 3).map(news => ({
          type: 'news',
          title: `News: ${news.title}`,
          time: news.createdAt,
          icon: <FaNewspaper className="text-green-500" />,
        })),
      ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

      setRecentActivity(activity);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Team Members',
      value: stats.teamMembers,
      icon: <FaUsers className="text-blue-500" />,
      color: 'bg-blue-50 border-blue-200',
      change: '+2 this month',
    },
    {
      title: 'Total Events',
      value: stats.events,
      icon: <FaCalendarAlt className="text-green-500" />,
      color: 'bg-green-50 border-green-200',
      change: `${stats.upcomingEvents} upcoming`,
    },
    {
      title: 'News Articles',
      value: stats.news,
      icon: <FaNewspaper className="text-purple-500" />,
      color: 'bg-purple-50 border-purple-200',
      change: '+3 this week',
    },
    {
      title: 'Form Submissions',
      value: stats.formSubmissions,
      icon: <FaWpforms className="text-orange-500" />,
      color: 'bg-orange-50 border-orange-200',
      change: `${stats.pendingForms} pending`,
    },
  ];

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
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome to TDA Admin Panel</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <FaEye />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl border-2 ${card.color} hover:shadow-lg transition-shadow duration-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{card.change}</p>
                </div>
                <div className="text-3xl">{card.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              <FaChartLine className="text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl">{item.icon}</div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(item.time).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border-2 border-blue-200 transition-colors duration-200">
                <FaUsers className="text-blue-500 text-2xl mb-2" />
                <p className="font-medium text-gray-900">Add Team Member</p>
              </button>
              <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border-2 border-green-200 transition-colors duration-200">
                <FaCalendarAlt className="text-green-500 text-2xl mb-2" />
                <p className="font-medium text-gray-900">Create Event</p>
              </button>
              <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border-2 border-purple-200 transition-colors duration-200">
                <FaNewspaper className="text-purple-500 text-2xl mb-2" />
                <p className="font-medium text-gray-900">Write News</p>
              </button>
              <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border-2 border-orange-200 transition-colors duration-200">
                <FaWpforms className="text-orange-500 text-2xl mb-2" />
                <p className="font-medium text-gray-900">View Forms</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;