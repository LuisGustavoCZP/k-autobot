const { createDriver, until, By } = require('./webdriver');
const { Talk } = require('./talks');

(async function example() {
  
  const driver = await createDriver();
  try {
    const talk1 = "BrasilPk";
    const talk2 = "AlphaDMKenzie";
    
    const talk = new Talk(driver);
    await talk.enter(talk2);
    const msgs = await talk.read();
    await talk.send("Repetindo ultima mensagem \n" + msgs[msgs.length-1].msg);
    //await talk.send("Meu criador só me permite mandar msg sem utilidade alguma");

    /* await driver.wait(until.elementLocated(
    {
        xpath: "//div[contains(@class,'tchurulipa')]"
    })); */
    //
  } finally {
    await driver.quit();
  }
})();