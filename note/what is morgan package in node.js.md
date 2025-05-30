In Node.js, **Morgan** is a **HTTP request logger middleware** for **Express** applications.

In simple terms:

- Morgan **logs details** about every HTTP request your server receives (such as method, URL, status code, response time).
- It's mainly used for **debugging** and **monitoring** your server during development (and sometimes production).

---

### How it works:

When a request hits your server, Morgan automatically prints a log line to the console (or to a file if configured).

Example log output:

```
GET /users 200 45ms
POST /login 401 32ms
```

---

### How to use it:

First, install it:

```bash
npm install morgan
```

Then in your Express app:

```javascript
const express = require('express');
const morgan = require('morgan');

const app = express();

// Use morgan middleware
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

The `'dev'` argument tells Morgan to use a nice colored log format for development.

---

### Morgan formats:

Morgan comes with several built-in formats you can use:

- `'combined'` — standard Apache-style logs (good for production)
- `'common'` — a shorter version of 'combined'
- `'dev'` — colored concise output (useful in development)
- `'short'` — very minimal output
- `'tiny'` — the minimal amount of logging

You can also **create custom formats**.

---

### Quick summary:

| Feature        | Details                                    |
| -------------- | ------------------------------------------ |
| Purpose        | HTTP request logging middleware            |
| Common Usage   | Debugging, monitoring                      |
| Installation   | `npm install morgan`                       |
| Common Formats | `'dev'`, `'combined'`, `'short'`, `'tiny'` |

---

Would you like me to show you an example where Morgan saves logs into a file too (for production)? 🚀
