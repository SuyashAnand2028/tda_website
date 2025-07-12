const express = require('express');
const TeamMember = require('../models/TeamMember');
const authenticateToken = require('../middleware/auth');
const { teamUpload } = require('../utils/upload');
const router = express.Router();

// Get all team members (public)
router.get('/', async (req, res) => {
  try {
    const teamMembers = await TeamMember.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });
    res.json(teamMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get team member by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.json(teamMember);
  } catch (error) {
    console.error('Error fetching team member:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new team member (protected)
router.post('/', authenticateToken, teamUpload.single('image'), async (req, res) => {
  try {
    const teamMemberData = { ...req.body };
    
    // If file was uploaded, use the Cloudinary URL
    if (req.file) {
      teamMemberData.image = req.file.path;
    }
    
    // Parse social media if it's a string
    if (typeof teamMemberData.socialMedia === 'string') {
      teamMemberData.socialMedia = JSON.parse(teamMemberData.socialMedia);
    }
    
    // Parse skills if it's a string
    if (typeof teamMemberData.skills === 'string') {
      teamMemberData.skills = teamMemberData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
    }

    const teamMember = new TeamMember(teamMemberData);
    await teamMember.save();
    res.status(201).json(teamMember);
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(400).json({ message: 'Error creating team member', error: error.message });
  }
});

// Update team member (protected)
router.put('/:id', authenticateToken, teamUpload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // If new file was uploaded, use the Cloudinary URL
    if (req.file) {
      updateData.image = req.file.path;
    }
    
    // Parse social media if it's a string
    if (typeof updateData.socialMedia === 'string') {
      updateData.socialMedia = JSON.parse(updateData.socialMedia);
    }
    
    // Parse skills if it's a string
    if (typeof updateData.skills === 'string') {
      updateData.skills = updateData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
    }

    const teamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    
    res.json(teamMember);
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(400).json({ message: 'Error updating team member', error: error.message });
  }
});

// Delete team member (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const teamMember = await TeamMember.findByIdAndDelete(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle team member active status (protected)
router.patch('/:id/toggle-active', authenticateToken, async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    
    teamMember.isActive = !teamMember.isActive;
    await teamMember.save();
    
    res.json(teamMember);
  } catch (error) {
    console.error('Error toggling team member status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
