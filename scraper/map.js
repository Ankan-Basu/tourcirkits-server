const {Builder, By, Key, until} = require('selenium-webdriver');

// (async function example() {
//   let driver = await new Builder().forBrowser('chrome').build();
//   try {
//     await driver.get('http://www.google.com/ncr');
//     await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
//     await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
//   } finally {
//     await driver.quit();
//   }
// })();

let count = 0;

const scrap = async(dest) => {
  const driver = await new Builder().forBrowser('chrome').build();
  try {
    await driver.get('https://www.google.com/maps')
    const searchBox = await driver.findElement(By.xpath('/html/body/div[3]/div[9]/div[3]/div[1]/div[1]/div/div[2]/form/input'));
    await searchBox.sendKeys(dest, Key.RETURN);
    // await driver.sleep(5000);
    const desc = await driver.wait(until.elementLocated(By.xpath('/html/body/div[3]/div[9]/div[9]/div/div/div[1]/div[2]/div/div[1]/div/div/div[7]/div[1]/span[1]/span[1]')));

    const descStr = await desc.getText()
    console.log(descStr);

    const restaurantButton = await driver.wait(until.elementLocated(By.xpath('/html/body/div[3]/div[9]/div[5]/div/div/div/div[1]/div/div/div/div/div[5]/div[2]/div[1]/button')));
    count++;

    await restaurantButton.click();
    await driver.sleep(5000);
  } catch(err) {

  } finally {
    await driver.quit();
  }
}

scrap('Sikkim').then(() => {
  scrap('Namchi').then(() => console.log(count));
});