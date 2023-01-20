const puppeteer = require('puppeteer');

const scrap = async(dest) => {
  let browser = undefined;
  try {
    browser = await puppeteer.launch({
      // headless: false,
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
      // console.log('Found');
    } catch(err) {
      // console.log('Not found');
      return [];
    }

    const locTypeXpath = '//button[@class="DkEaL u6ijk"]';
    const descXpath = '//div[@class="PYvSYb"]';
    

    let res = ['', '']
    try {
      res = await Promise.all([getData(locTypeXpath, page), getData(descXpath, page)]);
    }catch(err) {
      //res = ['', ''];
      return [];
    }

    // console.log(res);
    // console.log('finis');
    return res;    

  } catch(err) {
    console.log(err);
    throw 'Internal Server Error';
  } finally {
    if (browser) await browser.close();
  }
}


// const dest = process.argv[2];
// scrap(dest).then().catch((err) => console.log(err));


async function getData(xpath, page) {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log('in func')
      await page.waitForSelector('xpath/'+xpath, {timeout: 5000})
      const selec = await page.$x(xpath);
      data = await page.evaluate(el => el.textContent, selec[0])
      // return data;
      resolve(data);
    } catch(err) {
      reject(err);
    }
  })
}

module.exports = scrap;