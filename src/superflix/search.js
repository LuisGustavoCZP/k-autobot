const { WebDriver, WebElement, until, By, Key } = require('../webdriver');

class Search
{
    /**
     * @type {WebDriver}
     */
    driver;

    /**
     * 
     * @param {WebDriver} driver 
     */
    constructor (driver)
    {
        this.driver = driver;
    }

    /**
     * 
     * @param {string} text 
     * @returns //{Promise<{type: string; img: string; title: string;link: string;rating: string;year: string;}[]>}
     */
    async execute (text)
    {
        const locatorSearch = By.id("searchform");
        await this.driver.wait(until.elementLocated(locatorSearch));
        const searchElement = await this.driver.findElement(locatorSearch);
        searchElement.click();

        const locatorInput = By.xpath('.//input');

        const searchInput = await searchElement.findElement(locatorInput);
        searchInput.sendKeys(text, Key.RETURN);
        //contenedor
        const locatorResults = By.xpath(`//div[@id='contenedor']/div[@class='module']/div[@class='content rigth csearch']/div[@class='search-page']`);
        await this.driver.wait(until.elementLocated(locatorResults));
        const resultsContainer = await this.driver.findElement(locatorResults);
        const resultsEl = await resultsContainer.findElements(By.xpath(`.//div[@class='result-item']/article`));

        const results = [];

        const ratingRegex = /(<span class="rating">)(.[^\s])*(<\/span>)/gi;
        const yearRegex = /(<span class="year">)(.[^\s])*(<\/span>)/gi;
        const linkRegex = /https:\/\/[\w\.]*\//gi;
        const innerTagRegex = />.*</gi;
        const removeInnerTagRegex = />|</gi;

        for (const resultEl of resultsEl)
        {
            const resultItem = {}

            const resultTumbnailEl = await resultEl.findElement(By.xpath(`.//div[@class='image']/div/a`));

            const resultTypeEl = await resultTumbnailEl.findElement(By.xpath(`.//span`));
            resultItem.type = await resultTypeEl.getText();

            const resultImgEl = await resultTumbnailEl.findElement(By.xpath(`.//img`));
            resultItem.image = await resultImgEl.getAttribute("src");

            const resultDetailsEl = await resultEl.findElement(By.xpath(`.//div[@class='details']`));

            const resultTitleEl = await resultDetailsEl.findElement(By.xpath(`.//div[@class='title']/a`));
            resultItem.title = await resultTitleEl.getText();
            
            resultItem.url = (await resultTitleEl.getAttribute("href"));//.replace(linkRegex, "");

            const resultMetaEl = await resultDetailsEl.findElement(By.xpath(`.//div[@class='meta']`));
            const metaHas = await resultMetaEl.getAttribute("innerHTML");
            
            const ratingMatchs = metaHas.match(ratingRegex);
            if(ratingMatchs && ratingMatchs.length > 0)
            {
                //const resultRatingBEl = await resultMetaEl.findElement(By.xpath(`.//span[@class='rating']`));
                ratingMatchs[0] = ratingMatchs[0].match(innerTagRegex)[0].replace(removeInnerTagRegex, '');
                resultItem.rating = ratingMatchs[0].replace(/[a-z]|\s/gi, '');
            }
            
            const yearMatchs = metaHas.match(yearRegex);
            if(yearMatchs && yearMatchs.length > 0)
            {
                //const resultYearEl = await resultMetaEl.findElement(By.xpath(`.//span[@class='year']`));
                //resultItem.year = await resultYearEl.getText();
                yearMatchs[0] = yearMatchs[0].match(innerTagRegex)[0].replace(removeInnerTagRegex, '');
                resultItem.year = yearMatchs[0];
            }
            
            results.push(resultItem);
        }

        return results;
    }
}

module.exports = Search;
