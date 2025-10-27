const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Comment cannot be empty!'],
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Comment must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Comment must belong to a user.'],
    },
    photo: {
      type: String, // Store the filename of uploaded photo
    },
    emojiReactions: [
      {
        emoji: {
          type: String,
          required: true,
        },
        users: [
          {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
          },
        ],
        count: {
          type: Number,
          default: 0,
        },
      },
    ],
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    replies: [
      {
        text: {
          type: String,
          required: true,
          maxlength: [300, 'Reply cannot exceed 300 characters'],
        },
        user: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Index for efficient querying
commentSchema.index({ tour: 1, createdAt: -1 });
commentSchema.index({ user: 1 });
commentSchema.index({ 'emojiReactions.users': 1 });

// Virtual for like count
commentSchema.virtual('likeCount').get(function () {
  return this.likes ? this.likes.length : 0;
});

// Virtual for reply count
commentSchema.virtual('replyCount').get(function () {
  return this.replies ? this.replies.length : 0;
});

// Pre-save middleware to update emoji reaction counts
commentSchema.pre('save', function (next) {
  this.emojiReactions.forEach((reaction) => {
    reaction.count = reaction.users.length;
  });
  this.updatedAt = Date.now();
  next();
});

// Populate user data when querying
commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  }).populate({
    path: 'replies.user',
    select: 'name photo',
  });
  next();
});

// Static method to get comments for a specific tour
commentSchema.statics.getTourComments = function (
  tourId,
  page = 1,
  limit = 10,
) {
  const skip = (page - 1) * limit;
  return this.find({ tour: tourId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to add emoji reaction
commentSchema.statics.addEmojiReaction = async function (
  commentId,
  userId,
  emoji,
) {
  const comment = await this.findById(commentId);
  if (!comment) {
    throw new Error('Comment not found');
  }

  // Find existing emoji reaction
  let emojiReaction = comment.emojiReactions.find((r) => r.emoji === emoji);

  if (emojiReaction) {
    // Check if user already reacted with this emoji
    const userIndex = emojiReaction.users.indexOf(userId);
    if (userIndex === -1) {
      // Add user to reaction
      emojiReaction.users.push(userId);
    } else {
      // Remove user from reaction (toggle)
      emojiReaction.users.splice(userIndex, 1);
    }
  } else {
    // Create new emoji reaction
    comment.emojiReactions.push({
      emoji,
      users: [userId],
      count: 1,
    });
  }

  return comment.save();
};

// Static method to toggle like
commentSchema.statics.toggleLike = async function (commentId, userId) {
  const comment = await this.findById(commentId);
  if (!comment) {
    throw new Error('Comment not found');
  }

  const likeIndex = comment.likes.indexOf(userId);
  if (likeIndex === -1) {
    // Add like
    comment.likes.push(userId);
  } else {
    // Remove like
    comment.likes.splice(likeIndex, 1);
  }

  return comment.save();
};

// Static method to add reply
commentSchema.statics.addReply = async function (commentId, userId, text) {
  const comment = await this.findById(commentId);
  if (!comment) {
    throw new Error('Comment not found');
  }

  comment.replies.push({
    text,
    user: userId,
    createdAt: new Date(),
  });

  return comment.save();
};

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
