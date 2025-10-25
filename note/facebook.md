Perfect 👌 — let’s continue and build the **backend** (Node.js + Express + MongoDB) part for handling the “Nice tour” comment.

---

## ⚙️ Step-by-Step Backend Setup

We’ll assume you already have:

- Express app (`app.js`)
- MongoDB connected (via Mongoose)
- `Tour` model

We’ll now add:

- A `Comment` model
- A route (`POST /api/tours/:id/comments`)
- A controller to save the comment

---

### 🧩 1. Comment Model (`models/commentModel.js`)

```js
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Comment text is required'],
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Comment', commentSchema);
```

---

### 🧩 2. Comment Route (`routes/commentRoutes.js`)

```js
import express from 'express';
import { addComment } from '../controllers/commentController.js';

const router = express.Router();

router.post('/tours/:id/comments', addComment);

export default router;
```

---

### 🧩 3. Comment Controller (`controllers/commentController.js`)

```js
import Comment from '../models/commentModel.js';

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: tourId } = req.params;

    const comment = await Comment.create({
      text,
      tour: tourId,
    });

    res.status(201).json({
      status: 'success',
      data: {
        comment,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
```

---

### 🧩 4. Connect It in `app.js`

```js
import express from 'express';
import commentRoutes from './routes/commentRoutes.js';

const app = express();

app.use(express.json());
app.use('/api', commentRoutes);

export default app;
```

---

### 🧪 5. Test the Flow

Now when the user clicks the **“Comment”** button and types:

> Nice tour

Your frontend sends:

```json
POST /api/tours/66f46c.../comments
{
  "text": "Nice tour"
}
```

✅ Backend saves it in MongoDB under the `comments` collection.
✅ Responds:

```json
{
  "status": "success",
  "data": {
    "comment": {
      "_id": "671c4d...",
      "text": "Nice tour",
      "tour": "66f46c...",
      "createdAt": "2025-10-25T19:45:00.000Z"
    }
  }
}
```

---

Would you like me to show how to **display those comments under each tour** (frontend rendering part)?
