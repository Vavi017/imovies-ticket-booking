import Theatre from '../models/Theatre.js';

// @desc    Get all theatres
// @route   GET /api/theatres
// @access  Public
export const getAllTheatres = async (req, res) => {
  try {
    const theatres = await Theatre.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: theatres.length,
      theatres
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch theatres'
    });
  }
};

// @desc    Get single theatre
// @route   GET /api/theatres/:id
// @access  Public
export const getTheatreById = async (req, res) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found'
      });
    }
    res.status(200).json({
      success: true,
      theatre
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch theatre'
    });
  }
};

// @desc    Create theatre
// @route   POST /api/theatres
// @access  Private/Admin
export const createTheatre = async (req, res) => {
  try {
    const theatre = await Theatre.create(req.body);
    res.status(201).json({
      success: true,
      theatre
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create theatre'
    });
  }
};

// @desc    Update theatre
// @route   PUT /api/theatres/:id
// @access  Private/Admin
export const updateTheatre = async (req, res) => {
  try {
    const theatre = await Theatre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found'
      });
    }
    res.status(200).json({
      success: true,
      theatre
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update theatre'
    });
  }
};

// @desc    Delete theatre
// @route   DELETE /api/theatres/:id
// @access  Private/Admin
export const deleteTheatre = async (req, res) => {
  try {
    const theatre = await Theatre.findByIdAndDelete(req.params.id);
    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Theatre removed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete theatre'
    });
  }
};
