import express, { json, urlencoded } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tda_website', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB successfully');
});

// Import routes
import authRoutes from './routes/auth.js';
import teamRoutes from './routes/team.js';
import eventRoutes from './routes/events.js';
import newsRoutes from './routes/news.js';
import formRoutes from './routes/forms.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/forms', formRoutes);

// Health check endpoints
app.get('/', (req, res) => {
  res.json({ message: 'TDA Backend Server is running!', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusText = {
    0: 'disconnected',
    1: 'connected', 
    2: 'connecting',
    3: 'disconnecting'
  }[dbStatus] || 'unknown';

  res.json({ 
    message: 'TDA Backend Server is running!', 
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatusText,
      connected: dbStatus === 1
    },
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
