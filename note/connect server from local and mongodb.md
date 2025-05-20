### PROBLEM :- Error: queryTxt ETIMEOUT cluster0

```
PS D:\node\complete-node-bootcamp-master\4-natours\starter> nodemon server.js
\[nodemon] 3.1.10
\[nodemon] to restart at any time, enter `rs`
\[nodemon] watching path(s): *.*
\[nodemon] watching extensions: js,mjs,cjs,json
\[nodemon] starting `node server.js`
App running on port 3000...
node\:internal/dns/promises:293
this.reject(new DNSException(err, this.bindingName, this.hostname));
^

Error: queryTxt ETIMEOUT cluster0.6botkt0.mongodb.net
at QueryReqWrap.onresolve \[as oncomplete] (node\:internal/dns/promises:293:17) {
errno: undefined,
code: 'ETIMEOUT',
syscall: 'queryTxt',
hostname: 'cluster0.6botkt0.mongodb.net'
}

Node.js v22.14.0
\[nodemon] app crashed - waiting for file changes before starting...
```

This new error means your app is **trying to connect to MongoDB Atlas**, but it **can’t resolve the DNS for the MongoDB cluster** (`cluster0.6botkt0.mongodb.net`) due to a **network issue or misconfiguration**.

### 🔍 What the error means:

- `queryTxt ETIMEOUT` → Node.js couldn’t get DNS TXT records for the MongoDB cluster because the **request timed out**.
- This usually happens due to one of the following:

  - No internet connection.
  - DNS problems.
  - MongoDB Atlas network access settings blocking your request.

---

### ✅ Step-by-step Fix:

#### 1. **Check your internet connection**

Make sure you're connected to the internet and can access websites.

#### 2. **Whitelist your IP in MongoDB Atlas**

If you're using MongoDB Atlas:

- Go to [MongoDB Atlas](https://cloud.mongodb.com/)
- Select your project and cluster
- Go to **Network Access** > **IP Whitelist**
- Add your current IP address (or use `0.0.0.0/0` for all IPs, temporarily for testing)

#### 3. **Try using Google DNS**

If it's a DNS resolution issue, you can switch your DNS to Google:

- Open `Control Panel` > `Network and Internet` > `Network Connections`
- Right-click your active adapter > **Properties**
- Select **Internet Protocol Version 4 (TCP/IPv4)** > **Properties**
- Use the following DNS:

  - Preferred: `8.8.8.8`
  - Alternate: `8.8.4.4`

#### 4. **Check your MongoDB URI**

Make sure your `.env` file or config file has a correct connection string like:

```env
DATABASE=mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.6botkt0.mongodb.net/natours?retryWrites=true&w=majority
```

And don't forget to load it in your app using `dotenv.config()`.

---

### 🛠 If you just want to test locally:

You can switch to using **local MongoDB** instead of MongoDB Atlas if needed:

```js
const DB = 'mongodb://localhost:27017/natours';
```

Let me know which option you prefer, and I can guide you through setting it up!

## yes

Great! Since you said **"yes"**, I’ll guide you to run the project **locally** using **MongoDB installed on your computer**, rather than relying on MongoDB Atlas.

---

### ✅ Steps to Use MongoDB Locally:

#### 1. **Install MongoDB on your computer (if not already installed)**

If you're on Windows:

- Download the MongoDB Community Server from:
  👉 [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

- Install it and make sure the **MongoDB service is running** (it usually starts automatically).

To verify MongoDB is installed and running, open a new terminal and type:

```bash
mongod
```

> If this shows an error like "command not found", MongoDB is not correctly installed.

---

#### 2. **Update your connection string**

In your `server.js` or your config file, **replace the cloud URI** with the local one:

```js
const DB = 'mongodb://127.0.0.1:27017/natours';
```

Then make sure you connect like this (using mongoose):

```js
const mongoose = require('mongoose');

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful!');
  });
```

---

#### 3. **Start MongoDB and your project**

- First, make sure MongoDB is running locally (`mongod` in one terminal).
- In another terminal, navigate to your project folder and run:

```bash
nodemon server.js
```

If everything is set up properly, you should see:

```
App running on port 3000...
DB connection successful!
```

---

Would you like me to help verify your current `server.js` or `.env` file to make sure you're connecting correctly? You can paste your code here.

### server.js

```
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
'<PASSWORD>',
process.env.DATABASE\_PASSWORD,
);

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
console.log(`App running on port ${port}...`);
});
```

Thanks! Your `server.js` code is structured correctly. You're loading environment variables from a `.env` file and using `mongoose.connect()` to connect to your MongoDB database.

Since you want to run MongoDB **locally**, you'll need to **bypass the cloud-based URI (`process.env.DATABASE`)** and instead use a direct local connection string.

---

### ✅ Here's how to update your `server.js` for local use:

#### **Step 1: Replace the `DB` line**

Change this:

```js
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
```

To this:

```js
const DB = 'mongodb://127.0.0.1:27017/natours';
```

> This assumes MongoDB is running on your local machine and port `27017` (the default).

---

### ✅ Final `server.js` (for local MongoDB):

```js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

// Connect to local MongoDB
const DB = 'mongodb://127.0.0.1:27017/natours';

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
```

---

### ✅ Step 2: Make sure MongoDB is running

Open a separate terminal and start the local MongoDB server:

```bash
mongod
```

If it says `waiting for connections on port 27017`, you're good to go.

---

### ✅ Step 3: Start your app

Now, run:

```bash
nodemon server.js
```

If everything works, you’ll see:

```
DB connection successful!
App running on port 3000...
```

---

Let me know if you haven’t installed MongoDB locally yet — I can help you with that too.

### config.env

```
NODE\_ENV=development
PORT=3000
DATABASE=mongodb+srv://sentflix1:<PASSWORD>@cluster0.6botkt0.mongodb.net/sentour?retryWrites=true\&w=majority\&appName=Cluster0
DATABASE\_HOST=cluster0.6botkt0.mongodb.net
DATABASE\_LOCAL=mongodb://localhost:27017/natours-test
DATABASE\_USERNAME=sentflix1
DATABASE\_PASSWORD=sentflix2020
```

Perfect! You've shared your `.env` file, and it looks good overall. Since you're switching to a **local MongoDB database**, we’ll update your `server.js` to use `DATABASE_LOCAL` instead of the cloud-based URI.

---

### ✅ Updated Steps (using `.env` for local DB):

#### 1. **Keep your `.env` as it is**, but make sure `DATABASE_LOCAL` is correct:

```env
DATABASE_LOCAL=mongodb://127.0.0.1:27017/natours-test
```

> You can keep both cloud and local URIs in the `.env` file. We'll choose which to use based on `NODE_ENV`.

---

#### 2. **Update `server.js` to switch between local and cloud DB:**

Replace your DB config line with this logic:

```js
const DB =
  process.env.NODE_ENV === 'development'
    ? process.env.DATABASE_LOCAL
    : process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
```

This way:

- When you're in development (as per your `.env`: `NODE_ENV=development`), you'll connect to **localhost**.
- In production, you’ll connect to **MongoDB Atlas** (after replacing the password).

---

### ✅ Final version of `server.js`:

```js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

// Smart DB switch based on environment
const DB =
  process.env.NODE_ENV === 'development'
    ? process.env.DATABASE_LOCAL
    : process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// Connect to MongoDB
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
```

---

### ✅ Finally:

Make sure MongoDB is running locally:

```bash
mongod
```

Then in your project folder:

```bash
nodemon server.js
```

---

Let me know if you see a success message or get any new errors. I’m here to help you through the next step!
