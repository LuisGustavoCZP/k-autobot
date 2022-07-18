const {Builder, Browser, By, Key, until, WebDriver, WebElement, WebElementPromise, WebElementCondition} = require('selenium-webdriver');

async function createDriver ()
{
    let driver = await new Builder().forBrowser(Browser.FIREFOX).build();
    await driver.get('https://web.whatsapp.com/');
    //await driver.sleep(2000);
    
    return driver;
}

module.exports = {createDriver, By, Key, until, WebDriver, WebElement, WebElementPromise, WebElementCondition};