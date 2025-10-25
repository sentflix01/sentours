Perfect 😎 — this is the next professional step: making your real-time comment system **session-based**, so users don’t have to type their name each time — it’s automatically tied to their **login**.

We’ll integrate a simple **user authentication system** using **Express + MongoDB + JWT (JSON Web Tokens)**.

---

## ⚙️ Step-by-Step: Add Login & Auto User Identification

---

### 🧩 1. Create a User Model

File: `models/userModel.js`

```js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User name required'],
  },
  email: {
    type: String,
    required: [true, 'User email required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password required'],
    minlength: 6,
    select: false,
  },
  avatar: {
    type: String,
    default: function () {
      return `https://api.dicebear.com/9.x/thumbs/svg?seed=${this.name}`;
    },
  },
});

// 🔹 Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// 🔹 Check password validity
userSchema.methods.correctPassword = async function (candidate, userPass) {
  return await bcrypt.compare(candidate, userPass);
};

export default mongoose.model('User', userSchema);
```

---

### 🧩 2. Authentication Controller

File: `controllers/authController.js`

```js
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const signToken = (id) =>
  jwt.sign({ id }, 'my-secret-key', { expiresIn: '7d' });

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });

    const token = signToken(user._id);
    res.status(201).json({
      status: 'success',
      token,
      data: { user },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res
        .status(401)
        .json({ status: 'fail', message: 'Invalid credentials' });
    }

    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token,
      data: { user },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
```

---

### 🧩 3. Protect Comment Route

We’ll ensure only logged-in users can comment.

File: `controllers/authMiddleware.js`

```js
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ message: 'You are not logged in' });
    }

    const decoded = jwt.verify(token, 'my-secret-key');
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    req.user = currentUser; // attach user to request
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
```

---

### 🧩 4. Update Comment Route to Use Authentication

File: `routes/commentRoutes.js`

```js
import express from 'express';
import {
  addComment,
  getAllComments,
} from '../controllers/commentController.js';
import { protect } from '../controllers/authMiddleware.js';

const router = express.Router();

router.post('/tours/:id/comments', protect, addComment);
router.get('/comments', getAllComments);

export default router;
```

---

### 🧩 5. Update Comment Controller to Use Logged-In User

File: `controllers/commentController.js`

```js
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: tourId } = req.params;

    const user = req.user; // user from protect middleware

    const comment = await Comment.create({
      text,
      tour: tourId,
      user: user.name,
      avatar: user.avatar,
    });

    const io = req.app.get('io');
    io.emit('newComment', {
      tourId,
      text: comment.text,
      user: user.name,
      avatar: user.avatar,
    });

    res.status(201).json({
      status: 'success',
      data: { comment },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
```

---

### 🧩 6. Frontend Integration

After login/signup, store the token locally and use it automatically.

```js
// Example login
async function login(email, password) {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data.status === 'success') {
    localStorage.setItem('token', data.token);
    alert('Logged in successfully!');
  }
}

// When commenting:
const token = localStorage.getItem('token');
const res = await fetch(`/api/tours/${tourId}/comments`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ text }),
});
```

---

### ✅ Final Flow

1. User signs up or logs in → gets JWT token.
2. The token automatically identifies the user (name + avatar).
3. When commenting, backend knows who posted.
4. Everyone instantly sees “Sintayehu: Nice tour” live.
5. No manual name/seed input needed.

---

Would you like me to show you how to **add a front-end login/signup UI (modal or popup)** connected to this backend next?
