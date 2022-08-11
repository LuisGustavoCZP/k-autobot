const {Builder, Browser, By, Key, until, WebDriver, WebElement, WebElementPromise, WebElementCondition, Options} = require('selenium-webdriver');
const { ServiceBuilder } = require('selenium-webdriver/firefox');
async function createDriver (url)
{
    let driver = await new Builder().forBrowser(Browser.FIREFOX).build();
    const serviceBuilder = new ServiceBuilder("");
    const options = new Options(driver);
    options.b = '/var/lib/flatpak/app/org.mozilla.firefox/x86_64/stable/9c4d1797620e52ab380ffcbbff9a947ccb39695a8ca14e44935d9578d5c88b6d/files/lib/firefox/';
    
    await driver.get(url);
    return driver;
}

module.exports = {createDriver, By, Key, until, WebDriver, WebElement, WebElementPromise, WebElementCondition};