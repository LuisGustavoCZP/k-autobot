const fs = require('fs');

class Configs 
{
    timers = JSON.parse(fs.readFileSync("./src/configs/timers.json"));
    get commands ()
    {
        return JSON.parse(fs.readFileSync("./src/configs/commands.json"));
    }
}

module.exports = new Configs();