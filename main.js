const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const cookiesPath = path.join(__dirname, 'cookies.json');
const outputPath = path.join(__dirname, 'tweets.json');

async function scrapeTweets({ url, scrolls = 5 }) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  if (!fs.existsSync(cookiesPath)) {
    console.error('cookies.json not found. Please export your Twitter cookies.');
    return;
  }

  // Load cookies from file with sameSite fix
  const cookies = JSON.parse(fs.readFileSync(cookiesPath, 'utf8')).map(cookie => {
    if (cookie.sameSite && !['Strict', 'Lax', 'None'].includes(cookie.sameSite)) {
      cookie.sameSite = 'None'; // Fix for invalid sameSite value
    }
    return cookie;
  });
  await context.addCookies(cookies);

  const page = await context.newPage();

  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Scroll to load more tweets
  for (let i = 0; i < scrolls; i++) {
    await page.mouse.wheel(0, 5000);
    await page.waitForTimeout(2000);
  }

  const tweets = await page.$$eval('article', articles => {
    return articles.map(article => {
      const tweetTextEl = article.querySelector('div[lang]');
      const userEl = article.querySelector('div.r-1f6r7vd > div > div > div > a');
      const timeEl = article.querySelector('time');
      const tweetLink = timeEl?.closest('a')?.href;

      return {
        user: userEl?.getAttribute('href')?.replace('/', '') || null,
        text: tweetTextEl?.textContent || '',
        time: timeEl?.getAttribute('datetime') || null,
        url: tweetLink || null
      };
    });
  });

  // Save to JSON file
  fs.writeFileSync(outputPath, JSON.stringify(tweets, null, 2), 'utf-8');
  console.log(`\nScraped ${tweets.length} tweets. Saved to tweets.json\n`);

  await browser.close();
}

// CLI argument handling
const argv = require('yargs')
  .option('url', {
    type: 'string',
    describe: 'Full Twitter URL (profile or search)',
    default: 'https://x.com/home'
  })
  .option('scrolls', {
    type: 'number',
    describe: 'Number of times to scroll to load tweets',
    default: 5
  }).argv;

scrapeTweets(argv);
