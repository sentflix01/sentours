A **slug** is a **URL-friendly string** that is typically used to identify a particular resource in a readable and SEO-friendly way.

---

## 🔤 What is a Slug?

* A **slug** is the part of a URL that is based on a **title or name**, but made:

  * **Lowercase**
  * **Hyphenated**
  * **Free of special characters**

### ✅ Example:

**Title:**
`"10 Tips to Learn Web Development!"`

**Slug:**
`"10-tips-to-learn-web-development"`

**Full URL (example):**
`https://example.com/blog/10-tips-to-learn-web-development`

---

## 🔧 Why Use Slugs?

| Benefit         | Description                                        |
| --------------- | -------------------------------------------------- |
| 📈 SEO Friendly | Search engines prefer descriptive URLs.            |
| 🔎 Readability  | Easier for humans to read and share.               |
| 🔐 Safer URLs   | Removes spaces, symbols, and non-ASCII characters. |
| 📂 Routing      | Slugs can be used instead of IDs in URLs.          |

---

## 💻 How to Generate a Slug (in JavaScript)

```js
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-'); // Replace spaces & special chars with -
}

// Usage
const title = "Learn Node.js in 7 Days!";
const slug = slugify(title);
console.log(slug); // "learn-node-js-in-7-days"
```

---

## 🧬 Mongoose Example with Slug Field

You might store a slug in the database like this:

```js
const mongoose = require('mongoose');
const slugify = require('slugify');

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
  slug: { type: String, unique: true }
});

// Automatically generate slug before saving
articleSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const Article = mongoose.model('Article', articleSchema);
```

---

## ✍️ Slug Libraries You Can Use

* [`slugify`](https://www.npmjs.com/package/slugify) – popular and easy

  ```bash
  npm install slugify
  ```
* `speakingurl`, `url-slug`, and others

---

## 📝 Summary

| Term       | Meaning                                     |
| ---------- | ------------------------------------------- |
| Slug       | URL-safe version of a string (like a title) |
| Looks like | `"how-to-learn-js"`                         |
| Used in    | URLs, routing, and databases                |

---

Would you like a live Express route example using slugs instead of IDs (like `/posts/:slug`)?
