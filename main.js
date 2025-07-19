const fs = require('fs');
const { chromium } = require('playwright');

(async () => {
  // Load cookies from file
  const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8')).map(cookie => {
    if (cookie.sameSite && !['Strict', 'Lax', 'None'].includes(cookie.sameSite)) {
      cookie.sameSite = 'Lax'; // Fix for invalid sameSite value
    }
    return cookie;
  });

  // Launch browser
  const browser = await chromium.launch({ headless: false, slowMo: 50 });
  const context = await browser.newContext();
  await context.addCookies(cookies);
  const page = await context.newPage();

  // Keyword-based search URL
  const searchQuery = 'open ai ghibli chatgpt';
  const encodedQuery = encodeURIComponent(searchQuery);
  const searchUrl = `https://x.com/search?q=${encodedQuery}&src=typed_query&f=top`;

  // Navigate and wait until basic DOM is loaded (not networkidle!)
  await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

  // Optional: wait for tweets to render
  await page.waitForSelector('article', { timeout: 15000 });

  // Scrape tweet content with emoji (get full HTML and innerText both)
  const tweets = await page.$$eval('article', articles =>
    articles.map(article => {
      const html = article.innerHTML;
      const text = article.innerText;
      return { html, text };
    })
  );

  // Output
  console.log(`Scraped ${tweets.length} tweets for query "${searchQuery}"`);
  tweets.forEach((t, i) => {
    console.log(`\n--- Tweet ${i + 1} ---\nText: ${t.text}`);
  });

  // Optionally save full HTML for emoji-preserved scraping
  fs.writeFileSync('tweets.json', JSON.stringify(tweets, null, 2));

  await browser.close();
})();