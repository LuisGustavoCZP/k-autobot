const { until, By, Key, WebDriver, WebElement } = require('./webdriver');
const { timers } = require('./config');
const Configs = require('./config');
'use strict';

function createCmdList ()
{
    const cmdL = Configs.commands.messages.map(cmd => cmd.text);
    cmdL.push(Configs.commands.exit);
    return cmdL.reduce((p, c) => `${p}\n ${c.replace(/\\/gi, '').replace(/(\/\.\*)/gi, '/').replace(/(\.\*)/gi, ' ')}`, '');
}

const cmdList = createCmdList();
console.log(`List:\n${cmdList}`);

/**
 * recebe um 'text'(string) e retira todos os emojis
 * @param {string} text 
 * @returns {string} texto sem emojis
 */
function excludeEmogis (text)
{
    const emojiRegex = require('@unicode/unicode-13.0.0/Binary_Property/Emoji/regex.js');
    const emojiComponentRegex = require('@unicode/unicode-13.0.0/Binary_Property/Emoji_Component/regex.js');
    const emojiModifierRegex = require('@unicode/unicode-13.0.0/Binary_Property/Emoji_Modifier/regex.js');
    const emojiModifierBaseRegex = require('@unicode/unicode-13.0.0/Binary_Property/Emoji_Modifier_Base/regex.js');
    const emojiPresentationRegex = require('@unicode/unicode-13.0.0/Binary_Property/Emoji_Presentation/regex.js');

    return text.replace(emojiRegex, "").replace(emojiComponentRegex, "").replace(emojiModifierRegex, "").replace(emojiModifierBaseRegex, "").replace(emojiPresentationRegex, "");
}

/**
 * recebe um 'response'(string) e as infos e transforma a response
 * @param {string} response
 * @param infos 
 * @returns {string} resposta transformada
 */
function translate (response, infos)
{
  let responseText = response;
  let i = 0;
  while(responseText.includes('$')) 
  {
    //console.log("Teste: i =", i);
    i = responseText.indexOf('$', i);
    if(i < 0) break;
    let f = responseText.indexOf(' ', i);
    let sub;
    if(f > 0)
    {
      sub = responseText.substring(i, f);
      i = f;
    } else {
      sub = responseText.substring(i);
    }
    responseText = responseText.replace(sub, infos[sub.slice(1)]);
  }
  return responseText;
}

class Talk 
{
    /** @type {WebDriver}*/
    driver;
    /** @type {string}*/
    talkName;
    /** @type {WebElement}*/
    messager;
    /** @type {WebElement}*/
    sender;
    /** @type {boolean}*/
    #exit;

    /**
     * @param {WebDriver} driver 
     */
    constructor (driver)
    {
        this.driver = driver;
        this.#exit = true;
    }

    /**
     * recebe um 'nome'(string), procura e abre o grupo que corresponda ao 'nome'
     * @param {string} name 
     */
    async enter (name)
    {
        this.talkName = name;
        const xpath = `//*[contains(@title, '${this.talkName}')]`; //`//*[@title=\"*${name}*\"]`
        await this.driver.wait(until.elementLocated({ xpath:  xpath }));
        const grupo = await this.driver.findElement(By.xpath(xpath));
        await this.driver.sleep(timers.enteringWait);
        grupo.click();

        await this.selectMessager ();
        await this.driver.sleep(timers.configuringWait);
    }

    /**
     * procura e captura o local onde se digita a mensagem
     * @returns {WebElement}
     */
    async selectMessager ()
    {
        console.log('Procurando messager');
        const xpath = "//*[@contenteditable=\"true\" and @title=\"Mensagem\"]";
        await this.driver.wait(until.elementLocated(
        {
            xpath: xpath
        }));
        console.log('Achei o messager');
        this.messager = await this.driver.findElement(By.xpath(xpath));
        //this.sender = await this.messager.findElement(By.xpath("./../../../div/button"));
    }

    /**
     * recebe um 'textInfo'(string) e transforma em um objeto {date, user}
     * @param {string} textInfo
     * @param {boolean} isBot
     * @returns objeto de informações da mensagem
     */
    #infoParse (textInfo, isBot)
    {
        const infoTexts = textInfo.split(/^(\[.*\])/g);
        const username = excludeEmogis(infoTexts[2].trim().replace(':', ''));
        return {date:this.#dateParse(infoTexts[1]), user:username, me:isBot};
    }

    /**
     * recebe um 'msgDate'(string) e transforma em uma sintaxe ISO
     * @param {string} msgDate 
     * @returns {string} data em formato ISO
     */
    #dateParse (msgDate)
    {
        const dateAll = msgDate.replace(/[\[\]]/g, '').split(', ').reverse(); 
        dateAll[0] = dateAll[0].split("/").reverse().join('-');
        const date = dateAll.join("T") + ':00.000Z';
        return date;
    }

    /**
     * recebe um 'total'(number) e o owner(undefined, 'in', 'out') mensagens para salvar
     * @param {number} total 
     * @param {string} owner
     * @returns mensagens com o texto e as informações de envio
     */
    async read (total=0, owner=undefined)
    {
        const msgContainers = await this.driver.findElements(By.xpath(`//div[contains(@class,'message${owner?`-${owner}`:''}')]/*/*/*/div[contains(@class,'copyable-text')]`));//${total==0?'':` and position()>last()-${total}`}
        const msgs = [];
        const max = msgContainers.length-1;
        const min = Math.max(max - total, 0);
        for(let i = max; i >= min; i--)
        {
            const msgContainer = msgContainers[i];
            const isBot = (await msgContainer.findElement(By.xpath("./../../../..")).getAttribute('class')).match(/message-(in|out)/)[0];
            //console.log("isBot?", isBot)
            const info = this.#infoParse(await msgContainer.getAttribute('data-pre-plain-text'), isBot == 'message-out');
            const txt = await msgContainer.findElement(By.xpath(".//*[contains(@class,'selectable-text')]/span")).getText();
            msgs.push(Object.assign({text:txt, bot:false}, info));
        };

        return msgs;
    }

    /**
     * recebe um 'text'(string) e envia como mensagem
     * @param {string} text
     * @returns se a mensagem foi enviada
     */
    async send (text)
    {
        this.messager.click();
        text.trim();

        for(const letter of text) 
        {
            this.messager.sendKeys(letter);  
            await this.driver.sleep(timers.digitationWait);
        };

        await this.driver.sleep(timers.finishingWait);
        this.messager.sendKeys(Key.RETURN);

        return true;
    }

    async waitCommands()
    {
        let msg;
        let newmsg = msg = (await this.read(1))[0];

        this.#exit = false;
        while (!this.#exit)
        {
            newmsg = (await this.read(1))[0]; //, 'in'
            this.#exit = newmsg.text.match(new RegExp(Configs.commands.exit, "gi"));
            if(this.#exit) break;
            //console.log("Checking", newmsg.text);
            if(newmsg && newmsg.text != msg?.text)
            {
                msg = newmsg;
                if(!msg.bot)
                {
                    //console.log("Reading", newmsg.text);      
                    let responseText = "Não entendi...";
                    const msgText = msg.text; //.replace("/", "")

                    for(let message of Configs.commands.messages)
                    {
                        if(msgText.match(new RegExp(message.text, "gi")))
                        {
                            responseText = translate(message.response, {username:msg.user, commands:cmdList});
                            break;
                        }
                    }

                    if(!msg.me || responseText != "Não entendi...") await this.send(responseText);
                    msg = {text:responseText, bot:true};
                }
            }
            
            await this.driver.sleep(timers.messageWait);
        }
    }
}



module.exports = { Talk };