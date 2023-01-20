const puppeteer = require('puppeteer');

const scrap = async(dest) => {
  let browser = undefined;
  try {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: false
    });

    const page = await browser.newPage();
    await page.goto('https://www.google.com/maps');

    const searchXpath = '/html/body/div[3]/div[9]/div[3]/div[1]/div[1]/div/div[2]/form/input';

    await page.waitForSelector('xpath/'+searchXpath, {timeout: 5000});

    await page.click('xpath/'+searchXpath);
    await page.keyboard.type(dest);

    const [response] = await Promise.all([
      page.waitForNavigation({timeout: 6000}),
      page.keyboard.press('Enter')
    ]);

    // const notFoundDivXpath = '/html/body/div[3]/div[9]/div[9]/div/div/div[1]/div[2]/div/div[1]/div/div/div[2]/div[1]/div[1]';

    // xpath full
    // '/html/body/div[3]/div[9]/div[9]/div/div/div[1]/div[2]/div/div[1]/div/div/div[2]/div[1]/div[1]/div[1]/h1'

    const resNameXpath = '//h1[@class="DUwDvf fontHeadlineLarge"]';

    try {
      await page.waitForSelector('xpath/'+resNameXpath, {timeout: 5000});
      console.log('Found');
    } catch(err) {
      console.log('Not found');
      return [];
    }

    // for (let i=0; i<100000; i++);
    await page.screenshot({path: 'initial.png'})

    const url = await page.evaluate(() => window.location.href);
    let coord = url.split('@')[1].split('/')[0].split(',');
    console.log(coord);

    console.log(url);

    await page.screenshot({path: 'final.png'})
    

  } catch(err) {
    console.log(err);
    throw 'Internal Server Error';
  } finally {
    if (browser) await browser.close();
  }
}

scrap('Nicco Park, Kolkata');