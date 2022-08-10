const { createDriver, until, By, Key } = require('../webdriver');

class Select
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
    async execute (url)
    {
        this.driver.get(url);

        const info = {};
        const data = {info};
        
        info.url = url;

        info.category = url.replace(/https:\/\/[\w\.]*\//gm, '').replace(/\/[\w.\-,\&\#\'\"\+\:\(\)\!\?]*\/$/gm, '').slice(0, -1);

        const locatorSelectionContainer = By.xpath(`//div[@id='single']`);
        await this.driver.wait(until.elementsLocated(locatorSelectionContainer));
        const selectionContainer = await this.driver.findElement(locatorSelectionContainer);

        Object.assign(info, await this.header(selectionContainer));

        data.seasons = await this.seasons(selectionContainer);

        return data;
    }

    async header (selectionContainer)
    {
        const info = {};

        const selectionHeader = await selectionContainer.findElement(By.className("sheader"));

        const selectionPoster = await selectionHeader.findElement(By.xpath(`.//div[@class='poster']/img`));
        info.title = await selectionPoster.getAttribute("alt");
        info.image = await selectionPoster.getAttribute("src");

        const selectionExtras = await selectionContainer.findElements(By.xpath(`.//div[@class='data']/div[@class='extra']/span`));
        info.date = await selectionExtras[0].getAttribute("innerText");
        
        const selectionOrigin = await selectionExtras[1].findElement(By.xpath('.//a'));
        info.origin = {
            name: await selectionOrigin.getAttribute("innerText"),
            url: await selectionOrigin.getAttribute("href")
        };

        const selectionGenders = await selectionContainer.findElements(By.xpath(`.//div[@class='data']/div[@class='sgeneros']/a`));
        info.genders = [];
        for (let selectionGender of selectionGenders)
        {
            const gender = {
                name: await selectionGender.getAttribute("innerText"),
                url: await selectionGender.getAttribute("href")
            };
            info.genders.push(gender);
        }

        return info;
    }

    async seasons (selectionContainer)
    {
        const seasons = [];
        const locatorResults = By.xpath(`.//div[@id='seasons']/div`);

        const seasonEls = await selectionContainer.findElements(locatorResults);
        //const seasonEls = await episodesContainer.findElements(By.xpath(".//"));

        for(const seasonEl of seasonEls) 
        {
            const season = {};
            const seasonHeaderEl = await seasonEl.findElement(By.xpath(".//div[@class='se-q']"));

            const idEl = await seasonHeaderEl.findElement(By.className("se-t"));
            season.id = await idEl.getAttribute("innerText");
            if(await idEl.getAttribute("class") != "se-t se-o")
            {
                seasonHeaderEl.click();
                await app.wait(until.elementsLocated(By.xpath(".//span[@class='se-t se-o'")));
            }

            const episodesEl = await seasonEl.findElements(By.xpath(".//div[@class='se-a']/ul[@class='episodios']/li"));
            
            season.episodes = []
            
            for(const episodeEl of episodesEl)
            {
                const episode = {};

                const idEl = await episodeEl.findElement(By.className("numerando"));
                episode.id = (await idEl.getAttribute("innerText")).split("-")[1].trim();

                const imgEl = await episodeEl.findElement(By.xpath(".//div[@class='imagen']/img"));
                episode.image = await imgEl.getAttribute("src");

                const titleEl = await episodeEl.findElement(By.xpath(".//div[@class='episodiotitle']/a"));
                
                episode.title = await titleEl.getAttribute("innerText");
                episode.url = await titleEl.getAttribute("href");

                const dateEl = await episodeEl.findElement(By.xpath(".//div[@class='episodiotitle']/span"));
                episode.date = await dateEl.getAttribute("innerText");

                const epDriver = await createDriver(episode.url);
                const locatorSourcePlayer = By.xpath(".//div[@id='source-player-1']/a");
                await epDriver.wait(until.elementLocated(locatorSourcePlayer));
                const sourcePlayer = await epDriver.findElement(locatorSourcePlayer);
                epDriver.get(await sourcePlayer.getAttribute("href"));

                const locatorAds = By.xpath(".//div[@id='banner']/div[@class='container']/center/div[@id='ads-grupo']/div/div/iframe");
                await epDriver.wait(until.elementsLocated(locatorAds));
                const serverAds = await epDriver.findElements(locatorAds);

                serverAds.forEach(element => 
                {
                    element.click();
                });

                const locatorServerContainer = By.id("my-div");
                await epDriver.wait(until.elementsLocated(locatorServerContainer));
                const serverContainer = await epDriver.findElement(locatorServerContainer);

                (await serverContainer.findElement(By.id("btn-0"))).click();

                const locatorIFrame = By.xpath(".//div[@id='iframe']/iframe");
                await epDriver.wait(until.elementsLocated(locatorIFrame));
                const iFrame = await epDriver.findElement(locatorIFrame);
                episode.player = await iFrame.getAttribute("outerHTML");
                
                await epDriver.quit();

                season.episodes.push(episode);
            };
            
            seasons.push(season);
        };

        return seasons;
    }
}

async function selectSerie (serie)
{
    serie.seasons=[];

    const locatorResults = By.xpath(`//div[@id='seasons']/div`);
    await app.wait(until.elementsLocated(locatorResults));

    const seasonEls = await app.findElements(locatorResults);
    //const seasonEls = await episodesContainer.findElements(By.xpath(".//"));

    for(const seasonEl of seasonEls) 
    {
        const season = {};
        const seasonHeaderEl = await seasonEl.findElement(By.xpath(".//div[@class='se-q']"));

        const idEl = await seasonHeaderEl.findElement(By.className("se-t"));
        season.id = await idEl.getAttribute("innerText");
        if(await idEl.getAttribute("class") != "se-t se-o")
        {
            seasonHeaderEl.click();
            await app.wait(until.elementsLocated(By.xpath(".//span[@class='se-t se-o'")));
        }

        const episodesEl = await seasonEl.findElements(By.xpath(".//div[@class='se-a']/ul[@class='episodios']/li"));
        
        season.episodes = []
        
        for(const episodeEl of episodesEl)
        {
            const episode = {};

            const idEl = await episodeEl.findElement(By.className("numerando"));
            episode.id = await idEl.getAttribute("innerText");

            const titleEl = await episodeEl.findElement(By.xpath(".//div[@class='episodiotitle']/a"));
            
            episode.title = await titleEl.getAttribute("innerText");
            episode.button = titleEl;

            season.episodes.push(episode);
        };
        console.log(season.episodes);
        
        serie.seasons.push(season);
    };
    
    console.log(serie);
    return serie;
}

async function select (item)
{
    const itemurl = await item.getAttribute('href');

    const hasCategory = itemurl.match(/(\/\w{2,}\/)/gi);
    if(!hasCategory || hasCategory.length == 0) return null;
    const category = hasCategory[0].replace(/\//g, "");
    
    const pageItem = 
    {
        category                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
    };

    console.log(category);
    item.click();

    if(category == "series") return await selectSerie(pageItem);
    else return pageItem;
}

module.exports = Select;