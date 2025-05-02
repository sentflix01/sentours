Setting up **ESLint + Prettier** in **VS Code** ensures clean, consistent, and error-free code formatting. Here's a step-by-step guide to set it up for JavaScript/TypeScript projects:

---

### ✅ Prerequisites

Ensure you have:

* **Node.js** installed.
* A **project initialized** (`npm init`).
* VS Code installed with ESLint and Prettier extensions.

---

### 1. **Install Necessary Packages**

```bash
npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier
```

For **TypeScript projects**, also install:

```bash
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

---

### 2. **Initialize ESLint**

```bash
npx eslint --init
```

Answer the prompts based on your project setup. For example:

* Type of modules: JavaScript/TypeScript
* Framework: React/Vue/None
* Style guide: Airbnb, Standard, etc.
* Format: JSON/YAML/JavaScript (for `.eslintrc`)

---

### 3. **Create or Update `.eslintrc.js` or `.eslintrc.json`**

Example (`.eslintrc.js`):

```js
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error'
  }
};
```

---

### 4. **Create `.prettierrc` File**

Example:

```json
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

You can also use `.prettierrc.js` or `.prettierrc.yaml`.

---

### 5. **Ignore Files**

Add `.eslintignore` and `.prettierignore` to skip files:

```
node_modules
dist
build
```

---

### 6. **VS Code Settings**

Go to your workspace settings (`.vscode/settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "eslint.validate": ["javascript", "typescript"]
}
```

Make sure the **ESLint** and **Prettier - Code formatter** extensions are installed and enabled.

---

### ✅ Bonus Tip

To lint and fix all files at once:

```bash
npx eslint . --ext .js,.ts --fix
```

---

Would you like me to generate a ready-to-use config for your specific project (e.g., React + TypeScript)?
