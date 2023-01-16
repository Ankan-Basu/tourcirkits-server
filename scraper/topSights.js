const puppeteer = require('puppeteer');

const scrap = async (dest) => {
  let browser = undefined;
  try {
    browser = await puppeteer.launch({
      // headless: false,
      defaultViewport: false
    });

    const page = await browser.newPage();
    await page.goto('https://www.google.com/travel/');

    const searchXpathInactive = '/html/body/c-wiz[2]/div/div[2]/div/c-wiz/div[1]/div/div[1]/div[1]/div[2]/div/div/div/div[1]/div/div/div[2]/input';

    // const searchXpathActive = '//*[@id="ow21"]/div[2]/div[2]/div/div[2]/input';

    // await page.waitForSelector('xpath/' + searchXpathInactive, { timeout: 5000 });
    await page.click('xpath/' + (searchXpathInactive));
    // await page.type('xpath/'+(searchXpathActive), 'Sikkim');
    await page.keyboard.type(dest)

    const [response] = await Promise.all([
      page.waitForNavigation(), // The promise resolves after navigation has finished
      page.keyboard.press('Enter')
      // page.click('a.my-link'), // Clicking the link will indirectly cause a navigation
    ]);

    
    const resultsDivClass = 'kQb6Eb';
    try {
      await page.waitForSelector('.' + resultsDivClass, { timeout: 5000 });
    } catch(err) {
      console.log('CATCH\nNot Found', dest);
      return [];
    }


    await page.evaluate(() => {
      window.scrollTo(0, document.querySelector('.kQb6Eb').scrollHeight);
    });

    const topSightsXpath = '//div[@class="NnEw9 OBk50c T1Yjbc"]';

    await page.waitForSelector('xpath/' + topSightsXpath, { timeout: 5000 });
    const topSights = await page.$x(topSightsXpath);
    // const imgClass = '.R1Ybne .pzJ1lf';


    const respArr = await Promise.all(topSights.map(async (sight) => {
      const placeImgSelec = await sight.$('.R1Ybne');
      const placeNameSelec = await sight.$$('xpath/.//div[@class="skFvHc YmWhbc"]');
      const placeDescSelec = await sight.$$('xpath/.//div[@class="nFoFM"]');
      const placeName = await page.evaluate((el) => el.textContent, placeNameSelec[0]);
      const placeDesc = await page.evaluate((el) => el.textContent, placeDescSelec[0]);
      const placeImg = await page.evaluate((im) => im.src, placeImgSelec);

      const respObj = {
        place: placeName,
        desc: placeDesc,
        image: placeImg
      }

      return respObj;
    }));

    return respArr;

  } catch (err) {
    console.log('CATCH\n', err);
    throw 'Internal Server Error';
    
  } finally {
    if(browser) await browser.close();
  }
}

// scrap('Sikkim').then((resp) => console.log(resp))
// .catch(() => console.log('Err'));
// scrap('Kolkata').then((resp) => console.log(resp));

module.exports = scrap;