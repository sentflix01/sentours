// Facebook-style social interactions for tour cards

document.addEventListener('DOMContentLoaded', function () {
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

        // Update comment count
        const commentCount = this.closest('.card__social').querySelector(
          '.comment-count span',
        );
        if (commentCount) {
          let currentCount = parseInt(commentCount.textContent) || 0;
          currentCount += 1;
          commentCount.textContent = `${currentCount} comments`;
        }

        // Add your comment functionality here (API call, etc.)
        console.log('Comment for tour:', tourId, ':', this.value);
        this.value = '';
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
      // Add functionality to show/hide comments here
    });
  });

  // Reaction count click functionality
  document.querySelectorAll('.reaction-count').forEach((count) => {
    count.addEventListener('click', function () {
      const tourId =
        this.closest('.card__social').querySelector('.comment-input').dataset
          .tourId;
      console.log('View reactions for tour:', tourId);
      // Add functionality to show who reacted here
    });
  });
});

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
