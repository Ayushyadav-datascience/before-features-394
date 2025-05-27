const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { createComment, getComments, deleteComment } = require('../controllers/commentController');

router.route('/:postId')
  .get(getComments)
  .post(protect, createComment);

router.delete('/:id', protect, deleteComment);

module.exports = router;
