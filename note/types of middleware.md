In **Mongoose**, there are two powerful types of middleware/hooks that let you run logic before or after certain events:

---

## 🔹 1. **Document Middleware** (a.k.a. doc middleware)

> Runs **before or after** a **document is saved, validated, removed, or initialized**.

### ✅ Examples:

* `pre('save')`
* `post('save')`
* `pre('validate')`
* `pre('remove')`

### 🧠 Used For:

* Hashing passwords before saving
* Validating or modifying data
* Sending welcome emails after saving

### 🧾 Example:

```js
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
```

🔎 Here, `this` refers to the **document** being saved.

---

## 🔹 2. **Query Middleware**

> Runs **before or after** a **query** is executed — like `find`, `findOne`, `update`, etc.

### ✅ Examples:

* `pre('find')`
* `pre('findOne')`
* `pre('findOneAndUpdate')`
* `post('find')`

### 🧠 Used For:

* Automatically filtering out inactive or deleted users
* Populating referenced fields
* Logging queries

### 🧾 Example:

```js
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
```

🔎 Here, `this` refers to the **query object**, not the document.

---

## 🔁 Comparison Table

| Feature          | Document Middleware (`pre('save')`)         | Query Middleware (`pre('find')`)       |
| ---------------- | ------------------------------------------- | -------------------------------------- |
| When it runs     | On document operations (`save`, `validate`) | On query operations (`find`, `update`) |
| `this` refers to | The actual **document**                     | The **query object**                   |
| Common uses      | Hashing password, validation                | Filtering, soft deletes, population    |
| Example          | `pre('save')`                               | `pre(/^find/)`                         |

---

## ✅ BONUS: Middleware Execution Order

* **`pre`** middleware runs **before** the operation.
* **`post`** middleware runs **after** the operation completes.

---

Let me know if you want examples applied to your project like `Natours` or `Empire X`.
