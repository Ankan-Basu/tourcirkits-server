const {Builder, By, Key, until} = require('selenium-webdriver');

const scrap = async(dest) => {
  let driver = undefined;
  try {
  driver = await new Builder().forBrowser('chrome').build();
  // console.log(driver);
    await driver.get('https://www.google.com/travel/');
  } catch(err) {
    console.log('catch\n', err);
  } finally {
    driver.quit();
  }
}

const dest = process.argv[2];
scrap(dest).then((resp) => {
  console.log(resp);
});