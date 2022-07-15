const {Builder, Browser, By, Key, until} = require('selenium-webdriver');

(async function example() {
  let driver = await new Builder().forBrowser(Browser.FIREFOX).build();
  try {
    await driver.get('https://web.whatsapp.com/');
    //await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);

    await driver.wait(until.elementLocated(
    {
        xpath: "//*[@title=\"🥷 AlphaDMKenzie 🥷\"]"
    }));

    const grupo = await driver.findElement(By.xpath("//*[@title=\"🥷 AlphaDMKenzie 🥷\"]"))
    grupo.click();

    await driver.wait(until.elementLocated(
    {
        xpath: "//div[contains(@class,'g0rxnol2')]"
    }));

    await driver.sleep(5000)

    const message = await driver.findElement(By.xpath("//div[contains(@class,'p3_M1')]/div[contains(@class,'g0rxnol2')]/div[@contenteditable=\"true\"]"))
    message.click();

    const text = "E ai galera! Sou o bot do luis!";
    for(const letter of text) 
    {
        message.sendKeys(letter);
    };
    message.sendKeys(Key.RETURN);
    

    await driver.wait(until.elementLocated(
    {
        xpath: "//div[contains(@class,'tchurulipa')]"
    }));
    //
  } finally {
    await driver.quit();
  }
})();