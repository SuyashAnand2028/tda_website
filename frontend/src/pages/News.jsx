import React, { useState, useEffect } from 'react';
import { newsAPI } from '../services/api';
import Navbar from '../components/Navbar';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await newsAPI.getAll();
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = news.filter(article => {
    if (filter === 'all') return true;
    if (filter === 'featured') return article.featured;
    return article.category === filter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const handleLike = async (articleId) => {
    try {
      await newsAPI.like(articleId);
      // Update the local state
      setNews(prevNews => 
        prevNews.map(article => 
          article._id === articleId 
            ? { ...article, likes: article.likes + 1 }
            : article
        )
      );
      if (selectedArticle && selectedArticle._id === articleId) {
        setSelectedArticle({ ...selectedArticle, likes: selectedArticle.likes + 1 });
      }
    } catch (error) {
      console.error('Error liking article:', error);
    }
  };

  const openArticle = async (article) => {
    try {
      // Fetch full article details to increment views
      const response = await newsAPI.getById(article._id);
      setSelectedArticle(response.data);
    } catch (error) {
      console.error('Error fetching article:', error);
      setSelectedArticle(article);
    }
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
              News & Updates
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Stay up to date with the latest announcements, achievements, and happenings from TDA.
              Discover what we've been working on and what's coming next.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { key: 'all', label: 'All News' },
              { key: 'featured', label: 'Featured' },
              { key: 'announcement', label: 'Announcements' },
              { key: 'achievement', label: 'Achievements' },
              { key: 'event', label: 'Events' },
              { key: 'project', label: 'Projects' },
              { key: 'general', label: 'General' }
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

          {/* News Grid */}
          {filteredNews.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-300 mb-2">No News Found</h3>
              <p className="text-gray-400">
                {filter === 'all' 
                  ? "There are no news articles available at the moment. Check back soon!"
                  : `No news found for the "${filter}" filter. Try selecting a different filter.`
                }
              </p>
            </div>
          ) : (
            <>
              {/* Featured Articles */}
              {filter === 'all' && news.some(article => article.featured) && (
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-white mb-6">Featured Stories</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {news.filter(article => article.featured).slice(0, 2).map((article) => (
                      <div
                        key={article._id}
                        className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden hover:border-cyan-500 transition-all duration-300 group cursor-pointer"
                        onClick={() => openArticle(article)}
                      >
                        {article.image && (
                          <div className="h-64 overflow-hidden">
                            <img
                              src={article.image}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                              Featured
                            </span>
                            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium">
                              {article.category}
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-gray-400 mb-4 line-clamp-3">
                            {article.excerpt || article.content.substring(0, 150) + '...'}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-400">
                            <div className="flex items-center space-x-4">
                              <span>{article.author?.name || 'Anonymous'}</span>
                              <span>{getTimeAgo(article.publishDate)}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                {article.views}
                              </span>
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                {article.likes}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Articles */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-6">
                  {filter === 'all' ? 'Latest News' : 
                   filter === 'featured' ? 'Featured Articles' :
                   `${filter.charAt(0).toUpperCase() + filter.slice(1)} News`}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNews.map((article) => (
                    <div
                      key={article._id}
                      className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden hover:border-cyan-500 transition-all duration-300 group cursor-pointer"
                      onClick={() => openArticle(article)}
                    >
                      {article.image && (
                        <div className="h-48 overflow-hidden">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          {article.featured && (
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                              Featured
                            </span>
                          )}
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium">
                            {article.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-3">
                          {article.excerpt || article.content.substring(0, 100) + '...'}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <div className="flex items-center space-x-2">
                            <span>{article.author?.name || 'Anonymous'}</span>
                            <span>•</span>
                            <span>{getTimeAgo(article.publishDate)}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {article.views}
                            </span>
                            <span className="flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              {article.likes}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Article Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">
                    {selectedArticle.category}
                  </span>
                  {selectedArticle.featured && (
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                {/* Article Image */}
                {selectedArticle.image && (
                  <div className="mb-6">
                    <img
                      src={selectedArticle.image}
                      alt={selectedArticle.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Article Header */}
                <div className="mb-6">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {selectedArticle.title}
                  </h1>
                  
                  <div className="flex items-center justify-between text-gray-400 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {selectedArticle.author?.name?.charAt(0) || 'A'}
                        </div>
                        <div>
                          <div className="text-white font-medium">{selectedArticle.author?.name || 'Anonymous'}</div>
                          <div className="text-sm">{selectedArticle.author?.role || 'Author'}</div>
                        </div>
                      </div>
                      <span>•</span>
                      <span>{formatDate(selectedArticle.publishDate)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {selectedArticle.views} views
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(selectedArticle._id);
                        }}
                        className="flex items-center text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {selectedArticle.likes} likes
                      </button>
                    </div>
                  </div>

                  {selectedArticle.excerpt && (
                    <p className="text-xl text-gray-300 leading-relaxed mb-6">
                      {selectedArticle.excerpt}
                    </p>
                  )}
                </div>

                {/* Article Content */}
                <div className="prose prose-invert max-w-none">
                  <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {selectedArticle.content}
                  </div>
                </div>

                {/* Tags */}
                {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedArticle.tags.map((tag, index) => (
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
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default News;
