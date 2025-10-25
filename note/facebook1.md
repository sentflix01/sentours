Perfect 😎 — let’s now build the **frontend display logic** for showing all comments under each tour (along with the “Nice tour” comment after submission).

We’ll assume you’re using **HTML + JavaScript (or Pug)** from your previous example.

---

## 🧱 1. Frontend Structure (HTML / Pug)

Let’s update your tour card section with a comment area:

### 🧩 **Pug example**

```pug
div.tour-card(data-tour-id=tour.id)
  h3= tour.name
  p= tour.description

  // Comment section
  div.comment-section
    ul.comment-list(id=`comments-${tour.id}`)
      // Comments will be inserted here dynamically

    input.comment-input(type="text" placeholder="Write a comment...")
    button.action-btn.comment-btn(data-tour-id=tour.id) 💬 Comment
```

---

## 💡 2. JavaScript for Fetching & Posting Comments

### 📜 **public/js/comments.js**

```js
document.addEventListener('DOMContentLoaded', () => {
  const commentButtons = document.querySelectorAll('.comment-btn');

  // 1️⃣ Load all comments for every tour on page load
  loadAllComments();

  // 2️⃣ Add click event for each "Comment" button
  commentButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const tourId = btn.dataset.tourId;
      const input = btn.previousElementSibling; // the input before the button
      const text = input.value.trim();

      if (!text) return alert('Please write a comment first!');

      // Send comment to backend
      try {
        const res = await fetch(`/api/tours/${tourId}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });

        const data = await res.json();
        if (data.status === 'success') {
          input.value = '';
          appendComment(tourId, data.data.comment.text);
        } else {
          alert('Failed to post comment');
        }
      } catch (err) {
        console.error('Error posting comment:', err);
      }
    });
  });
});

// 🔹 Append a comment under the right tour
function appendComment(tourId, text) {
  const list = document.querySelector(`#comments-${tourId}`);
  const li = document.createElement('li');
  li.textContent = text;
  list.appendChild(li);
}

// 🔹 Load all existing comments
async function loadAllComments() {
  try {
    const res = await fetch('/api/comments'); // endpoint we'll create next
    const data = await res.json();

    if (data.status === 'success') {
      data.data.comments.forEach((comment) => {
        appendComment(comment.tour, comment.text);
      });
    }
  } catch (err) {
    console.error('Error loading comments:', err);
  }
}
```

---

## 🧩 3. Backend Route for “Get All Comments”

In your `commentRoutes.js` file, add:

```js
import {
  addComment,
  getAllComments,
} from '../controllers/commentController.js';

router.post('/tours/:id/comments', addComment);
router.get('/comments', getAllComments); // 👈 new route
```

### Add this in `commentController.js`

```js
export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find();
    res.status(200).json({
      status: 'success',
      data: { comments },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
```

---

## 💥 4. Final Flow

✅ Page loads → `loadAllComments()` fetches all existing comments and displays them.
✅ User types “Nice tour” → clicks 💬 Comment → it appears instantly under that tour.
✅ Data is stored in MongoDB.

---

Would you like me to make this version **real-time** (so that new comments appear instantly for all users using Socket.io)?
