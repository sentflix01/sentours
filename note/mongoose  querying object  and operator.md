## 008 CRUD Querying (Reading) Documents
Query operators in mongodb
1. db.tours.find(). 

Here’s a list of **MongoDB querying operators**, organized by type for easier reference:

---

### 🔍 **Comparison Operators**

Used to compare values in documents.

| Operator | Description                            |
| -------- | -------------------------------------- |
| `$eq`    | Equal to                               |
| `$ne`    | Not equal to                           |
| `$gt`    | Greater than                           |
| `$gte`   | Greater than or equal to               |
| `$lt`    | Less than                              |
| `$lte`   | Less than or equal to                  |
| `$in`    | Matches any value in an array          |
| `$nin`   | Matches none of the values in an array |

---

### 🔄 **Logical Operators**

Used to combine query conditions.

| Operator | Description                        |
| -------- | ---------------------------------- |
| `$and`   | Joins query clauses with AND       |
| `$or`    | Joins query clauses with OR        |
| `$not`   | Inverts the effect of a query      |
| `$nor`   | Joins clauses with NOR (none true) |

---

### 🔁 **Element Operators**

Test fields for existence or type.

| Operator  | Description            |
| --------- | ---------------------- |
| `$exists` | Checks if field exists |
| `$type`   | Matches field type     |

---

### 📚 **Evaluation Operators**

Perform more complex queries.

| Operator | Description                            |
| -------- | -------------------------------------- |
| `$expr`  | Use aggregation expressions in queries |
| `$regex` | Regular expression match               |
| `$mod`   | Modulo match                           |
| `$text`  | Text search                            |
| `$where` | JavaScript expression                  |

---

### 📦 **Array Operators**

Query fields that are arrays.

| Operator     | Description                                        |
| ------------ | -------------------------------------------------- |
| `$all`       | Matches arrays that contain all elements           |
| `$elemMatch` | Matches documents in arrays that match a condition |
| `$size`      | Matches arrays with specific length                |

---

### 🔗 **Bitwise Operators**

Match numeric or binary fields.

| Operator        | Description        |
| --------------- | ------------------ |
| `$bitsAllSet`   | All bits are set   |
| `$bitsAnySet`   | Any bit is set     |
| `$bitsAllClear` | All bits are clear |
| `$bitsAnyClear` | Any bit is clear   |

---

### 🧩 **Projection Operators** (when selecting fields)

These are used in `.find()` to shape the result.

| Operator     | Description                         |
| ------------ | ----------------------------------- |
| `1` or `0`   | Include or exclude fields           |
| `$slice`     | Return a subset of array elements   |
| `$elemMatch` | Return matching array element       |
| `$meta`      | Include metadata (e.g., text score) |

---

Would you like a cheat sheet or visual summary of these?


In **Mongoose**, a **query object** is the JavaScript object used to define the criteria for finding, updating, or deleting documents in a MongoDB collection. It closely follows MongoDB's native query syntax but can also leverage Mongoose features like chaining.

---

### 🧩 **Basic Mongoose Query Object Examples**

#### ✅ Find all users named "Alice":

```js
User.find({ name: "Alice" });
```

> Query Object: `{ name: "Alice" }`

---

#### ✅ Find users older than 25:

```js
User.find({ age: { $gt: 25 } });
```

> Query Object: `{ age: { $gt: 25 } }`

---

#### ✅ Find user by email (with chaining):

```js
User.findOne({ email: "alice@example.com" }).select("name age");
```

---

### 🔧 **Common Query Operators in Mongoose**

| Operator | Meaning                    | Example                                   |
| -------- | -------------------------- | ----------------------------------------- |
| `$gt`    | Greater than               | `{ age: { $gt: 18 } }`                    |
| `$lt`    | Less than                  | `{ age: { $lt: 65 } }`                    |
| `$gte`   | Greater than or equal      | `{ score: { $gte: 80 } }`                 |
| `$in`    | Matches any value in array | `{ role: { $in: ['admin', 'mod'] } }`     |
| `$regex` | Regular expression match   | `{ name: { $regex: /^A/i } }`             |
| `$or`    | Logical OR                 | `{ $or: [{ age: 18 }, { role: 'mod' }] }` |

---

### 🛠️ **Advanced Example**

```js
User.find({
  $or: [
    { age: { $lt: 20 } },
    { email: { $regex: /@example.com$/ } }
  ],
  isActive: true
});
```

> This finds users who are either under 20 or have an `@example.com` email, and are active.

---

### 🧪 **Query Object with `.findOneAndUpdate()`**

```js
User.findOneAndUpdate(
  { email: "test@example.com" },          // Query object
  { $set: { lastLogin: Date.now() } },    // Update object
  { new: true }                           // Options
);
```

---

### 🧰 Tools:

* `find()`, `findOne()`, `findById()`
* `findOneAndUpdate()`, `updateOne()`, `deleteOne()`
* Use `lean()`, `select()`, `populate()` to enhance performance or customize results

---

Would you like a cheat sheet or code snippets for common query patterns in Mongoose?
