const express = require('express');
const FormSubmission = require('../models/FormSubmission');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Submit form (public)
router.post('/submit', async (req, res) => {
  try {
    const { 
      fullName, 
      email, 
      branch, 
      year, 
      domainOfInterest, 
      message, 
      type = 'club_application',
      status = 'pending'
    } = req.body;
    
    const submission = new FormSubmission({
      formType: 'application',
      name: fullName,
      email,
      phone: '', // Not required for club applications
      message,
      formData: {
        branch,
        year,
        domainOfInterest,
        fullName,
        type,
        status
      },
      status: status,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    await submission.save();
    
    res.status(201).json({
      message: 'Application submitted successfully',
      submissionId: submission._id
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(400).json({ message: 'Error submitting form', error: error.message });
  }
});

// Get all form submissions (protected)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { formType, status, priority } = req.query;
    let filter = {};
    
    if (formType) filter.formType = formType;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    
    const submissions = await FormSubmission.find(filter)
      .populate('assignedTo', 'name email')
      .populate('response.respondedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching form submissions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get form submission by ID (protected)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const submission = await FormSubmission.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('response.respondedBy', 'name email');
    
    if (!submission) {
      return res.status(404).json({ message: 'Form submission not found' });
    }
    
    res.json(submission);
  } catch (error) {
    console.error('Error fetching form submission:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update form submission status (protected)
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status, priority, assignedTo } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (assignedTo) updateData.assignedTo = assignedTo;
    
    const submission = await FormSubmission.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('assignedTo', 'name email');
    
    if (!submission) {
      return res.status(404).json({ message: 'Form submission not found' });
    }
    
    res.json(submission);
  } catch (error) {
    console.error('Error updating form submission:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Respond to form submission (protected)
router.post('/:id/respond', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;
    
    const submission = await FormSubmission.findByIdAndUpdate(
      req.params.id,
      {
        status: 'responded',
        response: {
          message,
          respondedBy: req.user.userId,
          respondedAt: new Date()
        }
      },
      { new: true }
    ).populate('response.respondedBy', 'name email');
    
    if (!submission) {
      return res.status(404).json({ message: 'Form submission not found' });
    }
    
    res.json(submission);
  } catch (error) {
    console.error('Error responding to form submission:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete form submission (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const submission = await FormSubmission.findByIdAndDelete(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Form submission not found' });
    }
    res.json({ message: 'Form submission deleted successfully' });
  } catch (error) {
    console.error('Error deleting form submission:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get form statistics (protected)
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const totalSubmissions = await FormSubmission.countDocuments();
    const pendingSubmissions = await FormSubmission.countDocuments({ status: 'pending' });
    const approvedSubmissions = await FormSubmission.countDocuments({ status: 'approved' });
    const rejectedSubmissions = await FormSubmission.countDocuments({ status: 'rejected' });
    const respondedSubmissions = await FormSubmission.countDocuments({ status: 'responded' });
    
    const submissionsByType = await FormSubmission.aggregate([
      { $group: { _id: '$formType', count: { $sum: 1 } } }
    ]);
    
    const submissionsByStatus = await FormSubmission.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    res.json({
      total: totalSubmissions,
      pending: pendingSubmissions,
      approved: approvedSubmissions,
      rejected: rejectedSubmissions,
      responded: respondedSubmissions,
      byType: submissionsByType,
      byStatus: submissionsByStatus
    });
  } catch (error) {
    console.error('Error fetching form statistics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
