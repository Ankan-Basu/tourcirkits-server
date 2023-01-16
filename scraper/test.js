const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.google.com/travel/');
  await page.screenshot({path: 'eg.png'});

  await browser.close();
})();