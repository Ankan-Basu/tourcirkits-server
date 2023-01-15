const {Builder, By, Key, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');


const scrap = async (dest) => {
  const driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().headless()).build();
  try {
    await driver.get('https://www.google.com/travel/');
    
    const searchXpath = '//*[@id="ow21"]/div[2]/div[2]/div/div[2]/input';

    // const searchXpath2 = '//input[@class="II2One j0Ppje zmMKJ LbIaRd"]';

    const searchBox = await driver.wait(until.elementLocated(By.xpath('/html/body/c-wiz[2]/div/div[2]/div/c-wiz/div[1]/div/div[1]/div[1]/div[2]/div/div/div/div[1]/div/div/div[2]/input')), 5000);
    
    await searchBox.click();

    const searchBox2 = await driver.wait(until.elementLocated(By.xpath(searchXpath)), 5000);
    
    await searchBox2.sendKeys(dest, Key.RETURN);

    //results div
    try {
      await driver.wait(until.elementLocated(By.className('kQb6Eb')), 5000);
    } catch(err) {
      console.log('No res');
      return [];
    }

    await driver.executeScript('window.scrollTo(0, document.querySelector(\'.kQb6Eb\').scrollHeight);');

    const topSights = await driver.findElements(By.xpath('//div[@class="NnEw9 OBk50c T1Yjbc"]'), 5000);


    const respArr = await Promise.all(topSights.map(async (sight) => {
      const placeImg = await sight.findElement(By.className('R1Ybne')).getAttribute('src');
      const placeName = await sight.findElement(By.xpath('.//div[@class="skFvHc YmWhbc"]')).getText();
      const placeDesc = await sight.findElement(By.xpath('.//div[@class="nFoFM"]')).getText();
      
      const respObj = {
        place: placeName,
        desc: placeDesc,
        image: placeImg 
      }

      return respObj;
    }));

    return respArr;
  } catch(err) {
    console.log('catch');
    throw 'Internal Server Error';
    return [];
  } finally {
    await driver.quit();
  }
}

// scrap('Jamshedpur').then( resp => console.log(resp))
// .catch( err => console.log(err));
module.exports = scrap;

