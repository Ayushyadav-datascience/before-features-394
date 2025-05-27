const asyncHandler = require('express-async-handler');
const { Comment, User, Post } = require('../models/index');

// @desc    Get comments for a post
// @route   GET /api/comments/:postId
// @access  Public
const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.findAll({
    where: { postId: req.params.postId },
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'name']
    }],
    order: [['createdAt', 'DESC']]
  });
  
  res.json(comments);
});

// @desc    Create a comment
// @route   POST /api/comments/:postId
// @access  Private
const createComment = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text) {
    res.status(400);
    throw new Error('Please enter a comment');
  }

  // Check if post exists
  const post = await Post.findByPk(req.params.postId);
  if (!post) {
    res.status(404);
    throw new Error('Event not found');
  }

  const comment = await Comment.create({
    userId: req.user.id,
    postId: req.params.postId,
    text,
  });

  // Get comment with user data
  const populatedComment = await Comment.findByPk(comment.id, {
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'name']
    }]
  });

  res.status(201).json(populatedComment);
});

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findByPk(req.params.id);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  // Check if user is comment owner
  if (comment.userId !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to delete this comment');
  }

  await comment.destroy();
  res.json({ message: 'Comment removed' });
});

module.exports = {
  getComments,
  createComment,
  deleteComment,
};
