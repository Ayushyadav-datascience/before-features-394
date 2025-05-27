const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

// Define associations
User.hasMany(Post, { 
  foreignKey: 'userId',
  as: 'posts',
  onDelete: 'CASCADE'
});
Post.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Post.hasMany(Comment, {
  foreignKey: 'postId',
  as: 'comments',
  onDelete: 'CASCADE'
});
Comment.belongsTo(Post, {
  foreignKey: 'postId',
  as: 'post'
});

User.hasMany(Comment, {
  foreignKey: 'userId',
  as: 'comments',
  onDelete: 'CASCADE'
});
Comment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Create an Attendee model for the many-to-many relationship
const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const Attendee = sequelize.define('Attendee', {
  status: {
    type: DataTypes.ENUM('going', 'maybe', 'not going'),
    defaultValue: 'going',
    allowNull: false
  }
}, {
  timestamps: true
});

// Define the many-to-many relationship for event attendees
User.belongsToMany(Post, { 
  through: Attendee,
  foreignKey: 'userId',
  as: 'attendingEvents'
});

Post.belongsToMany(User, {
  through: Attendee,
  foreignKey: 'postId',
  as: 'attendees'
});

module.exports = {
  User,
  Post,
  Comment,
  Attendee
}; 