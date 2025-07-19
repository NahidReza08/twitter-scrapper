# 📘 Twitter/X Scraper with Playwright

This project uses [Playwright](https://playwright.dev/) to scrape tweet data from **X (formerly Twitter)** including content, username, timestamp, and emojis. It supports browsing profiles and keyword-based searches.

---

## 📦 Requirements

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Git Bash](https://git-scm.com/) (for running scripts on Windows)
- A valid **Twitter/X login** with session cookies

---

## 📁 Project Structure

```
twitter-x-scraper/
├── main.js              # Main scraping script
├── cookies.json         # Exported cookies (for logged-in access)
├── package.json         # Node.js metadata and dependencies
├── README.md            # This file
```

---

## 🔧 Setup

1. **Clone or download this repo**

2. **Install dependencies**

```bash
npm install
npx playwright install
```

3. **Export cookies**

To access protected or complete Twitter/X data, login to https://x.com in your browser and export cookies.

> You can use browser extensions like **Cookie-Editor** or DevTools > Application > Cookies.

Save your cookies to `cookies.json`.

> ✅ Make sure `sameSite` is set to `"Lax"` or `"Strict" or "None"` (not `"no_restriction"`), otherwise Playwright will throw an error.

4. **Run the scraper**

To scrape you need to pass the url and scroll number:

```bash
node main.js --url="https://x.com/elonmusk" --scrolls=10
```
---

## ✅ Sample Output
Output will be found on `tweets.json` file.

Each tweet scraped contains:

- 🧾 Full tweet text (including emojis)
- 👤 Username
- 🕒 Timestamp
- 🔗 Tweet URL

Example:

```json
{
  "user": "elonmusk",
  "text": "Excited about AI 🤖 and Mars 🚀!",
  "time": "2025-07-17T14:22:10Z",
  "url": "https://x.com/elonmusk/status/123456789"
}
```

---

## 🚨 Notes

- ⚠️ Scraping is against [Twitter's Terms of Service](https://x.com/en/tos). Use this tool responsibly for personal or academic use.
- 🔐 You must be logged in to view complete search results.
- 🐢 Set delays if needed to avoid rate-limiting or account lockout.

---

## 🧼 Cleanup

To clear `node_modules` or reset:

```bash
rm -rf node_modules
npm install
```

---

## 📄 License

MIT License — Free to use, with attribution.
