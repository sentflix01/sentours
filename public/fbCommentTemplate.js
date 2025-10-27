// Facebook-style social interactions for tour cards with API integration

document.addEventListener('DOMContentLoaded', function () {
  // Initialize comment sections for each tour
  initializeCommentSections();

  // Like button functionality
  document.querySelectorAll('.like-btn').forEach((btn) => {
    btn.addEventListener('click', function () {
      this.classList.toggle('liked');
      const tourId = this.dataset.tourId;

      // Update reaction count
      const reactionCount =
        this.closest('.card__social').querySelector('.reaction-count');
      if (reactionCount) {
        let currentCount = parseInt(reactionCount.textContent) || 0;
        if (this.classList.contains('liked')) {
          currentCount += 1;
        } else {
          currentCount = Math.max(0, currentCount - 1);
        }
        reactionCount.textContent = currentCount;
      }

      // Add your like functionality here (API call, etc.)
      console.log(
        'Liked tour:',
        tourId,
        'Status:',
        this.classList.contains('liked'),
      );
    });
  });

  // Comment button functionality
  document.querySelectorAll('.comment-btn').forEach((btn) => {
    btn.addEventListener('click', function () {
      const tourId = this.dataset.tourId;
      const commentInput = document.querySelector(
        `input[data-tour-id="${tourId}"]`,
      );
      if (commentInput) {
        commentInput.focus();
      }
    });
  });

  // Comment input functionality
  document.querySelectorAll('.comment-input').forEach((input) => {
    input.addEventListener('keypress', function (e) {
      if (e.key === 'Enter' && this.value.trim()) {
        const tourId = this.dataset.tourId;
        const commentText = this.value.trim();

        // Create comment via API
        createComment(tourId, commentText)
          .then(() => {
            // Update comment count
            const commentCount = this.closest('.card__social').querySelector(
              '.comment-count span',
            );
            if (commentCount) {
              let currentCount = parseInt(commentCount.textContent) || 0;
              currentCount += 1;
              commentCount.textContent = `${currentCount} comments`;
            }

            // Clear input
            this.value = '';

            // Refresh comments for this tour
            loadTourComments(tourId);
          })
          .catch((error) => {
            console.error('Error creating comment:', error);
            alert('Failed to post comment. Please try again.');
          });
      }
    });
  });

  // Share button functionality
  document.querySelectorAll('.share-btn').forEach((btn) => {
    btn.addEventListener('click', function () {
      const tourId = this.dataset.tourId;

      // Simple share functionality - you can enhance this
      if (navigator.share) {
        navigator
          .share({
            title: 'Check out this amazing tour!',
            text: 'I found this incredible tour that you might be interested in.',
            url: window.location.origin + `/tour/${tourId}`,
          })
          .catch((err) => console.log('Error sharing:', err));
      } else {
        // Fallback for browsers that don't support Web Share API
        const shareUrl = window.location.origin + `/tour/${tourId}`;

        // Try modern Clipboard API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard
            .writeText(shareUrl)
            .then(() => {
              alert('Tour link copied to clipboard!');
            })
            .catch(() => {
              // Final fallback - show link for manual copy
              alert(
                'Unable to copy automatically. Please copy this link manually: ' +
                  shareUrl,
              );
            });
        } else {
          // Fallback for very old browsers
          alert(
            'Unable to copy automatically. Please copy this link manually: ' +
              shareUrl,
          );
        }
      }

      console.log('Share tour:', tourId);
    });
  });

  // Emoji button functionality
  document.querySelectorAll('.emoji-btn').forEach((btn) => {
    btn.addEventListener('click', function () {
      if (this.disabled) {
        console.log('Emoji button is disabled - user not logged in');
        return;
      }
      const tourId = this.dataset.tourId;
      console.log('Emoji button clicked for tour:', tourId);
      toggleEmojiPicker(tourId);
    });
  });

  // Photo button functionality
  document.querySelectorAll('.photo-btn').forEach((btn) => {
    btn.addEventListener('click', function () {
      if (this.disabled) {
        console.log('Photo button is disabled - user not logged in');
        return;
      }
      const tourId = this.dataset.tourId;
      console.log('Photo button clicked for tour:', tourId);
      // Trigger the hidden file input
      const fileInput = document.getElementById(`comment-photo-${tourId}`);
      if (fileInput) {
        fileInput.click();
      } else {
        console.error('File input not found for tour:', tourId);
      }
    });
  });

  // Comment count click functionality
  document.querySelectorAll('.comment-count').forEach((count) => {
    count.addEventListener('click', function () {
      const tourId =
        this.closest('.card__social').querySelector('.comment-input').dataset
          .tourId;
      console.log('View comments for tour:', tourId);
      toggleCommentsSection(tourId);
    });
  });

  // Reaction count click functionality
  document.querySelectorAll('.reaction-count').forEach((count) => {
    count.addEventListener('click', function () {
      const tourId =
        this.closest('.card__social').querySelector('.comment-input').dataset
          .tourId;
      console.log('View reactions for tour:', tourId);
      showEmojiSummary(tourId);
    });
  });
});

// Initialize comment sections for all tours
function initializeCommentSections() {
  document.querySelectorAll('.card__social').forEach((socialSection) => {
    const tourId = socialSection.querySelector('.comment-input').dataset.tourId;
    if (tourId) {
      loadTourComments(tourId);
      loadTourEmojiSummary(tourId);
    }
  });
}

// Load comments for a specific tour
async function loadTourComments(tourId) {
  try {
    const response = await fetch(`/api/v1/tours/${tourId}/comments`);
    const data = await response.json();

    if (data.status === 'success') {
      displayComments(tourId, data.data.comments);
    }
  } catch (error) {
    console.error('Error loading comments:', error);
  }
}

// Display comments for a tour
function displayComments(tourId, comments) {
  const commentsContainer = document.getElementById(
    `comments-container-${tourId}`,
  );
  if (!commentsContainer) return;

  if (comments.length === 0) {
    commentsContainer.innerHTML =
      '<p class="no-comments">No comments yet. Be the first to comment!</p>';
    return;
  }

  const commentsHTML = comments
    .map(
      (comment) => `
    <div class="comment-item" data-comment-id="${comment._id}">
      <div class="comment-header">
        <img src="/img/users/${comment.user.photo || 'default.jpg'}" alt="${comment.user.name}" class="comment-avatar">
        <div class="comment-info">
          <span class="comment-author">${comment.user.name}</span>
          <span class="comment-time">${formatTimeAgo(comment.createdAt)}</span>
        </div>
      </div>
      <div class="comment-content">
        ${comment.text ? `<p class="comment-text">${comment.text}</p>` : ''}
        ${comment.photo ? `<img src="/img/comments/${comment.photo}" alt="Comment photo" class="comment-photo">` : ''}
      </div>
      <div class="comment-actions">
        <button class="comment-like-btn" onclick="toggleCommentLike('${comment._id}')">
          <span class="like-count">${comment.likeCount || 0}</span> 👍
        </button>
        <button class="comment-emoji-btn" onclick="showCommentEmojiPicker('${comment._id}')">
          😀
        </button>
        <button class="comment-reply-btn" onclick="showReplyForm('${comment._id}')">
          Reply
        </button>
      </div>
      <div class="comment-reactions" id="reactions-${comment._id}">
        ${displayCommentReactions(comment.emojiReactions)}
      </div>
      <div class="comment-replies" id="replies-${comment._id}">
        ${displayCommentReplies(comment.replies)}
      </div>
    </div>
  `,
    )
    .join('');

  commentsContainer.innerHTML = commentsHTML;
}

// Display comment reactions
function displayCommentReactions(reactions) {
  if (!reactions || reactions.length === 0) return '';

  return reactions
    .map(
      (reaction) => `
    <span class="comment-reaction" onclick="addCommentEmojiReaction('${reaction.emoji}')">
      ${reaction.emoji} ${reaction.count}
    </span>
  `,
    )
    .join('');
}

// Display comment replies
function displayCommentReplies(replies) {
  if (!replies || replies.length === 0) return '';

  return replies
    .map(
      (reply) => `
    <div class="comment-reply">
      <img src="/img/users/${reply.user.photo || 'default.jpg'}" alt="${reply.user.name}" class="reply-avatar">
      <div class="reply-content">
        <span class="reply-author">${reply.user.name}</span>
        <p class="reply-text">${reply.text}</p>
        <span class="reply-time">${formatTimeAgo(reply.createdAt)}</span>
      </div>
    </div>
  `,
    )
    .join('');
}

// Load emoji summary for a tour
async function loadTourEmojiSummary(tourId) {
  try {
    const response = await fetch(
      `/api/v1/tours/${tourId}/comments/emoji-summary`,
    );
    const data = await response.json();

    if (data.status === 'success') {
      displayEmojiSummary(tourId, data.data.emojiSummary);
    }
  } catch (error) {
    console.error('Error loading emoji summary:', error);
  }
}

// Display emoji summary
function displayEmojiSummary(tourId, emojiSummary) {
  const reactionsSummary = document
    .querySelector(`[data-tour-id="${tourId}"]`)
    .closest('.card__social')
    .querySelector('.reactions-summary .reaction-icons');
  if (!reactionsSummary) return;

  const emojiHTML = emojiSummary
    .slice(0, 4)
    .map(
      (item) => `
    <span class="reaction-icon" role="img" aria-label="${item.emoji}">${item.emoji}</span>
  `,
    )
    .join('');

  reactionsSummary.innerHTML = emojiHTML;
}

// Create a new comment
async function createComment(tourId, text, photo = null) {
  const response = await fetch(`/api/v1/tours/${tourId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      photo,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create comment');
  }

  return response.json();
}

// Toggle comment like
async function toggleCommentLike(commentId) {
  try {
    const response = await fetch(`/api/v1/comments/${commentId}/like`, {
      method: 'POST',
    });

    if (response.ok) {
      const data = await response.json();
      // Update the like count in the UI
      const likeBtn = document.querySelector(
        `[data-comment-id="${commentId}"] .comment-like-btn`,
      );
      if (likeBtn) {
        likeBtn.querySelector('.like-count').textContent =
          data.data.comment.likeCount;
      }
    }
  } catch (error) {
    console.error('Error toggling like:', error);
  }
}

// Add emoji reaction to comment
async function addCommentEmojiReaction(commentId, emoji) {
  try {
    const response = await fetch(`/api/v1/comments/${commentId}/emoji`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emoji }),
    });

    if (response.ok) {
      const data = await response.json();
      // Update reactions display
      const reactionsContainer = document.getElementById(
        `reactions-${commentId}`,
      );
      if (reactionsContainer) {
        reactionsContainer.innerHTML = displayCommentReactions(
          data.data.comment.emojiReactions,
        );
      }
    }
  } catch (error) {
    console.error('Error adding emoji reaction:', error);
  }
}

// Toggle comments section visibility
function toggleCommentsSection(tourId) {
  const commentsContainer = document.getElementById(
    `comments-container-${tourId}`,
  );
  if (!commentsContainer) {
    // Create comments container if it doesn't exist
    const socialSection = document
      .querySelector(`[data-tour-id="${tourId}"]`)
      .closest('.card__social');
    const commentsHTML = `
      <div class="comments-section" id="comments-container-${tourId}">
        <div class="comments-header">
          <h4>Comments</h4>
          <button class="close-comments-btn" onclick="toggleCommentsSection('${tourId}')">×</button>
        </div>
        <div class="comments-list">
          <!-- Comments will be loaded here -->
        </div>
      </div>
    `;
    socialSection.insertAdjacentHTML('beforeend', commentsHTML);
    loadTourComments(tourId);
  } else {
    commentsContainer.style.display =
      commentsContainer.style.display === 'none' ? 'block' : 'none';
  }
}

// Show emoji summary modal
function showEmojiSummary(tourId) {
  // Implementation for showing detailed emoji summary
  console.log('Show emoji summary for tour:', tourId);
}

// Format time ago
function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString();
}

// Photo preview function for comments
function previewCommentPhoto(event, tourId) {
  const file = event.target.files[0];
  const previewArea = document.getElementById(
    `comment-photo-preview-area-${tourId}`,
  );
  const previewImg = document.getElementById(`comment-photo-preview-${tourId}`);

  if (!previewArea || !previewImg) {
    console.error('Preview elements not found for tour:', tourId);
    return;
  }

  if (file) {
    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      event.target.value = ''; // Clear the input
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB.');
      event.target.value = ''; // Clear the input
      return;
    }

    // Upload photo first
    uploadCommentPhoto(file, tourId)
      .then((photoFilename) => {
        // Create comment with photo
        const commentInput = document.querySelector(
          `input[data-tour-id="${tourId}"]`,
        );
        if (commentInput && commentInput.value.trim()) {
          createComment(tourId, commentInput.value.trim(), photoFilename)
            .then(() => {
              commentInput.value = '';
              previewArea.style.display = 'none';
              loadTourComments(tourId);
            })
            .catch((error) => {
              console.error('Error creating comment with photo:', error);
              alert('Failed to post comment with photo. Please try again.');
            });
        }
      })
      .catch((error) => {
        console.error('Error uploading photo:', error);
        alert('Failed to upload photo. Please try again.');
      });

    // Create object URL and show preview
    const objectURL = URL.createObjectURL(file);
    previewImg.src = objectURL;
    previewArea.style.display = 'block';

    // Clean up previous object URL if it exists
    if (previewImg.dataset.objectUrl) {
      URL.revokeObjectURL(previewImg.dataset.objectUrl);
    }
    previewImg.dataset.objectUrl = objectURL;

    console.log('Photo preview created for tour:', tourId);
  } else {
    previewArea.style.display = 'none';
    if (previewImg.dataset.objectUrl) {
      URL.revokeObjectURL(previewImg.dataset.objectUrl);
      delete previewImg.dataset.objectUrl;
    }
    previewImg.src = '';
  }
}

// Upload comment photo
async function uploadCommentPhoto(file, tourId) {
  const formData = new FormData();
  formData.append('photo', file);

  const response = await fetch(
    `/api/v1/tours/${tourId}/comments/upload-photo`,
    {
      method: 'POST',
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error('Failed to upload photo');
  }

  const data = await response.json();
  return data.data.photo;
}

// Emoji picker functionality
const emojis = [
  '😀',
  '😃',
  '😄',
  '😁',
  '😆',
  '😂',
  '🤣',
  '😊',
  '😍',
  '😘',
  '😎',
  '😢',
  '😭',
  '😡',
  '👍',
  '👎',
  '❤️',
  '🔥',
  '👏',
  '🎉',
  '🎊',
  '🎈',
  '🎁',
  '🎂',
  '🍕',
  '🍔',
  '🍟',
  '🍰',
  '🍦',
  '🍭',
  '🌟',
  '⭐',
  '🌙',
  '☀️',
  '🌈',
  '⚡',
  '💯',
  '💪',
  '🙌',
  '👌',
  '🤞',
  '✌️',
  '🤝',
  '👋',
  '🤚',
  '👏',
  '🙏',
  '💝',
  '💖',
  '💕',
];

// Track which emoji pickers are visible
const visibleEmojiPickers = new Set();

function toggleEmojiPicker(tourId) {
  const picker = document.getElementById(`emoji-picker-container-${tourId}`);

  if (!picker) {
    console.error('Emoji picker container not found for tour:', tourId);
    return;
  }

  const isVisible = visibleEmojiPickers.has(tourId);

  // Close all other emoji pickers first
  visibleEmojiPickers.forEach((id) => {
    if (id !== tourId) {
      const otherPicker = document.getElementById(
        `emoji-picker-container-${id}`,
      );
      if (otherPicker) {
        otherPicker.style.display = 'none';
        visibleEmojiPickers.delete(id);
      }
    }
  });

  if (!isVisible) {
    // Show emoji picker
    picker.innerHTML = `
      <div class="emoji-picker-header">
        <span class="emoji-picker-title">Choose an emoji</span>
        <button class="emoji-picker-close" onclick="toggleEmojiPicker('${tourId}')" title="Close">×</button>
      </div>
      <div class="emoji-grid">
        ${emojis
          .map(
            (emoji) =>
              `<span class="emoji-item" onclick="addEmoji('${emoji}', '${tourId}')" title="${emoji}">${emoji}</span>`,
          )
          .join('')}
      </div>
    `;
    picker.style.display = 'block';
    visibleEmojiPickers.add(tourId);
  } else {
    // Hide emoji picker
    picker.style.display = 'none';
    visibleEmojiPickers.delete(tourId);
  }
}

function addEmoji(emoji, tourId) {
  const input = document.querySelector(`input[data-tour-id="${tourId}"]`);
  if (input && !input.disabled) {
    input.value += emoji;
    input.focus();

    // Hide emoji picker after selection
    const picker = document.getElementById(`emoji-picker-container-${tourId}`);
    if (picker) {
      picker.style.display = 'none';
      visibleEmojiPickers.delete(tourId);
    }
  } else if (input && input.disabled) {
    console.log('Cannot add emoji - user not logged in');
    // Hide emoji picker even if user is not logged in
    const picker = document.getElementById(`emoji-picker-container-${tourId}`);
    if (picker) {
      picker.style.display = 'none';
      visibleEmojiPickers.delete(tourId);
    }
  } else {
    console.error('Comment input not found for tour:', tourId);
  }
}

// Close emoji picker when clicking outside
document.addEventListener('click', function (event) {
  if (
    !event.target.closest('.emoji-btn') &&
    !event.target.closest('.emoji-picker-container')
  ) {
    visibleEmojiPickers.forEach((tourId) => {
      const picker = document.getElementById(
        `emoji-picker-container-${tourId}`,
      );
      if (picker) {
        picker.style.display = 'none';
        visibleEmojiPickers.delete(tourId);
      }
    });
  }
});
