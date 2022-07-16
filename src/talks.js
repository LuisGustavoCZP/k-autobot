const { until, By, Key } = require('./webdriver');

class Talk 
{
    driver;
    talkName;
    messager;

    constructor (driver)
    {
        this.driver = driver;
    }

    async enter (name)
    {
        this.talkName = name;
        const xpath = `//*[contains(@title, '${this.talkName}')]`; //`//*[@title=\"*${name}*\"]`
        await this.driver.wait(until.elementLocated({ xpath:  xpath }));
        
        const grupo = await this.driver.findElement(By.xpath(xpath));
        grupo.click();

        await this.selectMessager ();
    }

    async selectMessager ()
    {
        await this.driver.wait(until.elementLocated(
        {
            xpath: "//div[contains(@class,'g0rxnol2')]"
        }));
    
        this.messager = await this.driver.findElement(By.xpath("//div[contains(@class,'p3_M1')]/div[contains(@class,'g0rxnol2')]/div[@contenteditable=\"true\"]"));
    }

    async read ()
    {
        const msgContainers = await this.driver.findElements(By.xpath("//div[contains(@class,'message')]/*/*/*/div[contains(@class,'copyable-text')]"));
        const msgs = []; 
        for(const msgContainer of msgContainers)
        {
            const info = await msgContainer.getAttribute('data-pre-plain-text');
            const txt = await msgContainer.findElement(By.xpath(".//*[contains(@class,'selectable-text')]/span")).getText();
            msgs.push({ msg:txt, info:info });
        };
        //console.log("Messages", msgs);

        return msgs;
    }

    async send (text)
    {
        this.messager.click();
        for(const letter of text) 
        {
            this.messager.sendKeys(letter);  
        };
        this.messager.sendKeys(Key.RETURN);
    }
}

module.exports = { Talk };