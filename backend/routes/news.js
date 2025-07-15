import express from 'express';
import News from '../models/News.js';
import authenticateToken from '../middleware/auth.js';
import { newsUpload } from '../utils/upload.js';

const router = express.Router();

// Get all published news (public)
router.get('/', async (req, res) => {
  try {
    const { category, featured, limit } = req.query;
    let filter = { status: 'published' };
    
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    
    let query = News.find(filter)
      .populate('author', 'name role')
      .sort({ publishDate: -1 });
    
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    
    const news = await query;
    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all news for admin (protected)
router.get('/admin', authenticateToken, async (req, res) => {
  try {
    const news = await News.find()
      .populate('author', 'name role')
      .sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get news by ID or slug
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    let news;
    
    // Try to find by ID first, then by slug
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      news = await News.findById(identifier).populate('author', 'name role');
    } else {
      news = await News.findOne({ slug: identifier }).populate('author', 'name role');
    }
    
    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }
    
    // Increment views
    news.views += 1;
    await news.save();
    
    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new news article (protected)
router.post('/', authenticateToken, newsUpload.single('image'), async (req, res) => {
  try {
    const newsData = {
      ...req.body,
      author: req.user.userId
    };
    
    // Parse JSON strings from FormData
    if (newsData.tags && typeof newsData.tags === 'string') {
      try {
        newsData.tags = JSON.parse(newsData.tags);
      } catch (e) {
        console.error('Error parsing tags:', e);
        newsData.tags = [];
      }
    }
    
    // If file was uploaded, use the Cloudinary URL
    if (req.file) {
      newsData.image = req.file.path;
    }
    
    const news = new News(newsData);
    await news.save();
    await news.populate('author', 'name role');
    res.status(201).json(news);
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(400).json({ message: 'Error creating news', error: error.message });
  }
});

// Update news article (protected)
router.put('/:id', authenticateToken, newsUpload.single('image'), async (req, res) => {
  try {
    const newsData = { ...req.body };
    
    // Parse JSON strings from FormData
    if (newsData.tags && typeof newsData.tags === 'string') {
      try {
        newsData.tags = JSON.parse(newsData.tags);
      } catch (e) {
        console.error('Error parsing tags:', e);
        newsData.tags = [];
      }
    }
    
    // If file was uploaded, use the Cloudinary URL
    if (req.file) {
      newsData.image = req.file.path;
    }
    
    const news = await News.findByIdAndUpdate(
      req.params.id,
      newsData,
      { new: true, runValidators: true }
    ).populate('author', 'name role');
    
    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }
    
    res.json(news);
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(400).json({ message: 'Error updating news', error: error.message });
  }
});

// Delete news article (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }
    res.json({ message: 'News article deleted successfully' });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like news article
router.patch('/:id/like', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }
    
    news.likes += 1;
    await news.save();
    
    res.json({ likes: news.likes });
  } catch (error) {
    console.error('Error liking news:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
