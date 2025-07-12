const express = require('express');
const Event = require('../models/Event');
const authenticateToken = require('../middleware/auth');
const { eventUpload } = require('../utils/upload');
const router = express.Router();

// Get all events (public - only published ones)
router.get('/', async (req, res) => {
  try {
    const { status, category, upcoming } = req.query;
    let filter = { isPublic: true };
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (upcoming === 'true') {
      filter.date = { $gte: new Date() };
    }
    
    const events = await Event.find(filter)
      .populate('organizers', 'name role')
      .sort({ date: 1 });
    
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all events for admin (protected)
router.get('/admin', authenticateToken, async (req, res) => {
  try {
    const events = await Event.find()
      .populate('organizers', 'name role')
      .sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizers', 'name role');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new event (protected)
router.post('/', authenticateToken, eventUpload.single('image'), async (req, res) => {
  try {
    const eventData = { ...req.body };
    
    // Parse JSON strings from FormData
    if (eventData.organizers && typeof eventData.organizers === 'string') {
      try {
        eventData.organizers = JSON.parse(eventData.organizers);
      } catch (e) {
        console.error('Error parsing organizers:', e);
        eventData.organizers = [];
      }
    }
    
    if (eventData.tags && typeof eventData.tags === 'string') {
      try {
        eventData.tags = JSON.parse(eventData.tags);
      } catch (e) {
        console.error('Error parsing tags:', e);
        eventData.tags = [];
      }
    }
    
    // If file was uploaded, use the Cloudinary URL
    if (req.file) {
      eventData.image = req.file.path;
    }
    
    const event = new Event(eventData);
    await event.save();
    await event.populate('organizers', 'name role');
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(400).json({ message: 'Error creating event', error: error.message });
  }
});

// Update event (protected)
router.put('/:id', authenticateToken, eventUpload.single('image'), async (req, res) => {
  try {
    const eventData = { ...req.body };
    
    // Parse JSON strings from FormData
    if (eventData.organizers && typeof eventData.organizers === 'string') {
      try {
        eventData.organizers = JSON.parse(eventData.organizers);
      } catch (e) {
        console.error('Error parsing organizers:', e);
        eventData.organizers = [];
      }
    }
    
    if (eventData.tags && typeof eventData.tags === 'string') {
      try {
        eventData.tags = JSON.parse(eventData.tags);
      } catch (e) {
        console.error('Error parsing tags:', e);
        eventData.tags = [];
      }
    }
    
    // If file was uploaded, use the Cloudinary URL
    if (req.file) {
      eventData.image = req.file.path;
    }
    
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      eventData,
      { new: true, runValidators: true }
    ).populate('organizers', 'name role');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(400).json({ message: 'Error updating event', error: error.message });
  }
});

// Delete event (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register for event
router.post('/:id/register', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    if (!event.registrationRequired) {
      return res.status(400).json({ message: 'This event does not require registration' });
    }
    
    // Check if already registered
    const alreadyRegistered = event.registeredParticipants.some(
      participant => participant.email === email
    );
    
    if (alreadyRegistered) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }
    
    // Check if event is full
    if (event.maxParticipants && event.registeredParticipants.length >= event.maxParticipants) {
      return res.status(400).json({ message: 'Event is full' });
    }
    
    event.registeredParticipants.push({ name, email, phone });
    await event.save();
    
    res.json({ message: 'Successfully registered for the event' });
  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
