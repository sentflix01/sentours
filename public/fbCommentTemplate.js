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
              // Final fallback - create temporary input and copy
              const textArea = document.createElement('textarea');
              textArea.value = shareUrl;
              textArea.style.position = 'fixed';
              textArea.style.opacity = '0';
              document.body.appendChild(textArea);
              textArea.select();
              textArea.setSelectionRange(0, 99999); // For mobile devices
              try {
                document.execCommand('copy');
                alert('Tour link copied to clipboard!');
              } catch (err) {
                alert('Unable to copy link. Please copy manually: ' + shareUrl);
              }
              document.body.removeChild(textArea);
            });
        } else {
          // Fallback for very old browsers
          const textArea = document.createElement('textarea');
          textArea.value = shareUrl;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.select();
          textArea.setSelectionRange(0, 99999);
          try {
            document.execCommand('copy');
            alert('Tour link copied to clipboard!');
          } catch (err) {
            alert('Unable to copy link. Please copy manually: ' + shareUrl);
          }
          document.body.removeChild(textArea);
        }
      }

      console.log('Share tour:', tourId);
    });
  });

  // Emoji button functionality
  document.querySelectorAll('.emoji-btn').forEach((btn) => {
    btn.addEventListener('click', function () {
      const tourId = this.closest('.comment-input-container').querySelector(
        '.comment-input',
      ).dataset.tourId;
      console.log('Emoji button clicked for tour:', tourId);
      // Add emoji picker functionality here
    });
  });

  // Photo button functionality
  document.querySelectorAll('.photo-btn').forEach((btn) => {
    btn.addEventListener('click', function () {
      const tourId = this.closest('.comment-input-container').querySelector(
        '.comment-input',
      ).dataset.tourId;
      console.log('Photo button clicked for tour:', tourId);
      // Add photo upload functionality here
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
