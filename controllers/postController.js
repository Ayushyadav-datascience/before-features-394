const asyncHandler = require('express-async-handler');
const { Post, User, Attendee } = require('../models/index');
const { Op } = require('sequelize');

// @desc    Get all posts/events
// @route   GET /api/posts
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
  const { search, category } = req.query;
  
  // Build query conditions
  const whereConditions = {};
  
  // Search functionality
  if (search) {
    whereConditions[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
      { location: { [Op.iLike]: `%${search}%` } }
    ];
  }
  
  // Category filter
  if (category && category !== 'all') {
    whereConditions.category = category;
  }
  
  // Get posts with filters
  const posts = await Post.findAll({
    where: whereConditions,
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'name'],
      },
      {
        model: User,
        as: 'attendees',
        through: {
          attributes: ['status'],
        },
        attributes: ['id', 'name'],
      },
    ],
    order: [['date', 'ASC']],
  });
  
  res.json(posts);
});

// @desc    Get single post/event
// @route   GET /api/posts/:id
// @access  Public
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findByPk(req.params.id, {
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'name'],
      },
      {
        model: User,
        as: 'attendees',
        through: {
          attributes: ['status'],
        },
        attributes: ['id', 'name'],
      },
    ],
  });

  if (post) {
    res.json(post);
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

// @desc    Create a post/event
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  const { title, description, category, date, time, location } = req.body;

  if (!title || !description || !category || !date || !time || !location) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }

  const post = await Post.create({
    userId: req.user.id,
    title,
    description,
    category,
    date,
    time,
    location,
  });

  // Get the post with user data
  const newPost = await Post.findByPk(post.id, {
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'name']
    }]
  });

  res.status(201).json(newPost);
});

// @desc    Update a post/event
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findByPk(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check if user is post owner
  if (post.userId !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to update this event');
  }

  // Update the post
  await post.update(req.body);
  
  // Return the updated post with associations
  const updatedPost = await Post.findByPk(req.params.id, {
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'name']
    }]
  });

  res.json(updatedPost);
});

// @desc    Delete a post/event
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findByPk(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check if user is post owner
  if (post.userId !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to delete this event');
  }

  await post.destroy();
  res.json({ message: 'Event removed' });
});

// @desc    RSVP to an event
// @route   POST /api/posts/:id/rsvp
// @access  Private
const rsvpToEvent = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const postId = req.params.id;
  const userId = req.user.id;
  
  // Check if post exists
  const post = await Post.findByPk(postId);
  if (!post) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check if already RSVP'd and update or create
  const [attendee, created] = await Attendee.findOrCreate({
    where: { postId, userId },
    defaults: { status }
  });

  if (!created) {
    // Update existing RSVP
    await attendee.update({ status });
  }

  // Get updated post with attendees
  const updatedPost = await Post.findByPk(postId, {
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'name'],
      },
      {
        model: User,
        as: 'attendees',
        through: {
          attributes: ['status'],
        },
        attributes: ['id', 'name'],
      },
    ],
  });

  res.json(updatedPost);
});

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  rsvpToEvent,
};
