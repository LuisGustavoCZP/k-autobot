const fs = require('fs');

class Configs 
{
    timers = JSON.parse(fs.readFileSync(`${__dirname}/configs/timers.json`));
    get commands ()
    {
        return JSON.parse(fs.readFileSync(`${__dirname}/configs/commands.json`));
    }
}

module.exports = new Configs();