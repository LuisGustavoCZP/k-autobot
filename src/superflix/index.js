const { createDriver, until, By } = require('../webdriver');
const Search = require('./search');
const Select = require('./select');

class Superflix
{
  /**
   * @type {WebDriver}
   */
  driver;
  #searchObj;
  #selectObj;

  constructor()
  {
    this.driver = null;
    this.#searchObj = null;
    this.#selectObj = null;
  }

  async start ()
  {
    this.driver = await createDriver('https://seriesflixtv3.vip/');
    this.#searchObj = new Search(this.driver);
    this.#selectObj = new Select(this.driver);
  }

  async search (text)
  {
    return await this.#searchObj.execute (text);
  }

  async select (text)
  {
    return await this.#selectObj.execute (text);
  }

  async quit ()
  {
    await this.driver.quit();
  }
}

const start = async () => 
{
  await appStart();
  
  const { app } = require('./app');
  const search = require('./search');
  const select = require('./select');
  //console.log(app);
  try {
    
    const series = await search("Resident Evil: A Série");

    const page = select(series[0]);

    
    await app.wait(until.elementLocated(By.id("trocim")));
    //await driver.sleep(5000);

  } catch (e) {
    console.log(e);
  } finally {
    
    await app.quit();
  }
};

module.exports = Superflix;