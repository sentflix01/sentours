From your description, you want each comment section (with its emojis, comments, and user pictures) to be strictly associated with a single tour. That means:

- **Comments, emojis, and profile pictures displayed in one tour's comment section should not appear in another tour's comment section.**
- **Each tour acts as an independent container for its own separate comment section** (and chat, if you have that functionality).
- **No mixing between tours:** Comment data must be fetched, saved, and presented only within the context of the associated tour.

**How to implement or enforce this (general steps):**

### 1. **Data Structure**

- Each comment (and emoji reaction) needs to be associated with a specific `tourId`.
- Database schema for comments should have a `tour` field (foreign key) referencing the relevant tour.

Example (in MongoDB, for reference):

```js
const commentSchema = new mongoose.Schema({
  text: String,
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  tour: { type: mongoose.Schema.ObjectId, ref: 'Tour' }, // This is critical!
  emojiReactions: [
    {
      emoji: String,
      users: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    },
  ],
  createdAt: { type: Date, default: Date.now },
});
```

### 2. **Frontend Filtering**

- When you open a tour page, fetch only **comments belonging to that tour** by passing the `tourId` in your API request.
- Display in the comment/chat section only the fetched data.
- Sending a new comment or emoji must include the correct `tourId`.

### 3. **Backend/API Filtering**

- The API endpoint for getting comments should filter by `tourId`:

  ```js
  // Pseudo-code for GET comments API
  GET /api/v1/comments?tour=<tourId>
  ```

  The controller should use something like:

  ```js
  const comments = await Comment.find({ tour: req.query.tour });
  ```

  Same filtering applies when posting new comments.

### 4. **Ensure Containers are Isolated**

- In your frontend code, your component/template for the comment section should always be passed (or fetch for) the current tour’s ID.
- Do NOT share state or arrays of comments, reactions, etc. across multiple tour pages.

### 5. **Rendering**

- When rendering comments, check their `tourId` matches the `tourId` of the tour page.
- Only load the relevant tour's comments for that page’s container.

---

**Summary Table:**

| Tour Page | Shown Comments         | Shown Emojis | Shown Profile Pictures     |
| --------- | ---------------------- | ------------ | -------------------------- |
| Tour A    | Only Tour A's Comments | Only for A   | Only commenting users in A |
| Tour B    | Only Tour B's Comments | Only for B   | Only commenting users in B |
| ...       | ...                    | ...          | ...                        |

---

If you show code (for example in `fbCommentTemplate.js` or wherever you generate or render comment sections), **make sure all read/write/fetch operations are keyed by `tourId`**.

---

### **If you want code review or help with a specific part (frontend or backend), please specify:**

- Which file/component (frontend or backend) you want to focus on
- What framework/library you’re using for the comment section binding (plain JS, React, template engine, etc.)

Let me know if you want a review of how to update current code, or if you need a more concrete example using your actual file structure.

Thank you for the clarification. Based on your previous messages and code, here is a **review and advice on what needs to be updated/checked**, so that the comments, emojis, and picture uploads are independent and strictly linked to each tour:

---

## **Current Code Status (fbCommentTemplate.js + overview.pug):**

- Every action (like, comment, emoji, photo) in your JavaScript is **already using `data-tour-id`** to scope the DOM selection and event to the right tour.
- The markup in `overview.pug` **dynamically outputs elements with the relevant `tour.id`** wired into `data-tour-id`, element IDs, and image preview containers.
- This means that, as designed, each comment section container is **already independent for each tour**.

**Key evidence in your code:**

- Event selectors and handlers always use `data-tour-id` (e.g., `btn.dataset.tourId`, `input[data-tour-id="${tourId}"]`).
- Elements such as `.like-btn`, `.comment-btn`, `.comment-input`, `.emoji-btn`, `.photo-btn`, file inputs, preview containers, and emoji pickers all get unique IDs/scope using `tour.id`.

---

## **What To Check and Where You Might Need Updates**

### 1. **Backend/Database Storage**

- Make sure that when you **store comments (or photos, emojis, etc.) in your database**, you also save a `tourId` (or reference to `tour`) with every comment, emoji, photo, or chat message.  
  Without this, comments could appear on the wrong tour page if queried incorrectly!

### 2. **Backend/API Fetch**

- **When loading comments for a specific tour:**  
  Only fetch **comments/photos/emojis whose `tourId` matches the current tour.**
  - For example, your GET API should look like `/api/v1/comments?tour=TOUR_ID`
  - And in your backend: `Comment.find({ tour: req.query.tour })`

### 3. **Frontend Data Handling**

- In future improvements, if you load comments via an AJAX API (not server-rendered), always **pass the correct tourId in the request and render the result in the right section.**
- When rendering, make sure to clear/reset state arrays for each section to avoid cross-over.

### 4. **Dynamic Counts**

- You currently use random/fake numbers for count displays in `overview.pug`:
  ```pug
  span.reaction-count= `${Math.floor(Math.random() * 50) + 10}`
  span.comment-count
      span= `${Math.floor(Math.random() * 20) + 5} comments`
  ```
  **Update these to real counts** (from backend or by counting actual displayed comments for that tour)!  
  Otherwise, users might see inconsistent comment/reaction counts per tour.

### 5. **Photo and Emoji Uploads**

- Make sure that when a user adds a photo or emoji, it submits with the **current tour's ID** and is only displayed within that specific tour's comment section.

---

## **To Summarize:**

- **Each comment section is already independent in the client UI** because of `tour.id` wiring.
- To fully enforce independence, ensure your **backend data structure and API code always act on a given tour's ID**.
- The only area to update in the frontend (based on your code) is maybe replacing the fake reaction/comment numbers with live data.

---

### **What does NOT need to change** (based on code seen):

- Your selectors, event bindings, and dynamic IDs in JS and pug are already scoped per-tour. Your JS will **not mix up comments, likes, emojis, or photos between tours** unless the backend/API does so.

---

### **If you need help with:**

- Changing the backend API to filter by `tourId`
- Updating the fake comment count to show real comment counts
- AJAX loading of comments for each tour

**Let me know which area (and file/backend/frontend) you want help updating. I can provide the code details for the update, ready to copy/paste!**
