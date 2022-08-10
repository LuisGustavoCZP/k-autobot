const {Builder, Browser, By, Key, until, WebDriver, WebElement, WebElementPromise, WebElementCondition} = require('selenium-webdriver');

async function createDriver (url)
{
    let driver = await new Builder().forBrowser(Browser.FIREFOX).build();
    await driver.get(url);
    return driver;
}

module.exports = {createDriver, By, Key, until, WebDriver, WebElement, WebElementPromise, WebElementCondition};