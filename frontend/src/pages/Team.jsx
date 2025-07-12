import React, { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { teamAPI } from '../services/api';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setError('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 text-white min-h-screen">
        <Navbar />
        <div className="pt-32 pb-20 px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-cyan-400 mb-4">Meet Our Team</h1>
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={fetchTeamMembers}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar />
      <div className="pt-32 pb-20 px-6">
        <h1 className="text-4xl font-bold text-center text-cyan-400 mb-4">
          Meet Our Team
        </h1>
        <p className="text-center text-gray-400 mb-12">
          {teamMembers.length > 0 
            ? "Hover over the cards to learn more about our amazing team members" 
            : "Our team page is being updated. Check back soon!"
          }
        </p>

        {teamMembers.length === 0 ? (
          // Empty state when no team members
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="text-6xl text-gray-600 mb-6">👥</div>
              <h3 className="text-2xl font-semibold text-gray-300 mb-4">No Team Members Yet</h3>
              <p className="text-gray-400 mb-6">
                Our amazing team members will be showcased here soon. 
                The admin is currently updating the team information.
              </p>
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-400">
                  <span className="text-cyan-400">Admin Notice:</span> Please use the admin panel to add team members.
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Team members grid when data exists
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
            {teamMembers.map((member) => (
              <div
                key={member._id}
                className="flip-card w-full h-80"
                style={{ perspective: '1000px' }}
              >
                <div className="flip-card-inner relative w-full h-full transition-transform duration-700 hover:[transform:rotateY(180deg)]" style={{ transformStyle: 'preserve-3d' }}>
                  {/* Front of Card */}
                  <div 
                    className="flip-card-front absolute inset-0 rounded-xl overflow-hidden shadow-lg bg-gray-800"
                    style={{ 
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden'
                    }}
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face";
                      }}
                    />
                    <div className="absolute bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent w-full text-center py-4">
                      <h3 className="font-bold text-lg text-white">{member.name}</h3>
                      <p className="text-sm text-cyan-300">{member.role}</p>
                    </div>
                  </div>

                  {/* Back of Card */}
                  <div 
                    className="flip-card-back absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 flex flex-col justify-between border border-cyan-400/20 shadow-lg"
                    style={{ 
                      transform: 'rotateY(180deg)',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden'
                    }}
                  >
                    {/* Member Info on Back */}
                    <div className="text-center">
                      <h3 className="font-bold text-xl text-white mb-2">{member.name}</h3>
                      <p className="text-cyan-400 font-medium text-sm mb-4">{member.role}</p>
                    </div>

                    {/* Quote */}
                    <div className="flex-1 flex items-center justify-center px-2">
                      <p className="italic text-sm text-gray-300 leading-relaxed text-center">
                        <span className="text-cyan-400 text-lg">"</span>
                        {member.quote || "Ready to make a difference with innovative solutions and creative thinking."}
                        <span className="text-cyan-400 text-lg">"</span>
                      </p>
                    </div>

                    {/* Social Media Links */}
                    <div className="border-t border-gray-700 pt-4">
                      <p className="text-xs text-gray-400 mb-3 text-center">Connect with me</p>
                      <div className="flex justify-center gap-4 text-xl">
                        {member.socialMedia?.github && (
                          <a
                            href={member.socialMedia.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-white transition-colors duration-200 hover:scale-110 transform"
                            title="GitHub"
                          >
                            <FaGithub />
                          </a>
                        )}
                        {member.socialMedia?.linkedin && (
                          <a
                            href={member.socialMedia.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-white transition-colors duration-200 hover:scale-110 transform"
                            title="LinkedIn"
                          >
                            <FaLinkedin />
                          </a>
                        )}
                        {member.socialMedia?.instagram && (
                          <a
                            href={member.socialMedia.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-white transition-colors duration-200 hover:scale-110 transform"
                            title="Instagram"
                          >
                            <FaInstagram />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action for Admins */}
        {teamMembers.length === 0 && (
          <div className="text-center mt-12">
            <a 
              href="/login" 
              className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              Admin Login to Add Team Members
            </a>
          </div>
        )}
      </div>

      <style jsx>{`
        .flip-card:hover .flip-card-inner {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default Team;
