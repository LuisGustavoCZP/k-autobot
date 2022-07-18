const { createDriver, until, By } = require('./webdriver');
const { Talk } = require('./talks');
const { timers } = require('./config');

//const t = translate("Olá $user", {user:"Luis Gustavo"});
//console.log(t);

const start = (async function example() {
  
  const driver = await createDriver();
  
  try {
    const talk = new Talk(driver);

    const talk0 = "Teste de BOT";
    const talk1 = "BrasilPk";
    const talk2 = "AlphaDMKenzie";
  
    await talk.enter(talk0);
    console.log('Iniciando');
    
    
    await talk.send("E ai galera! O bot ta on!!!");
    console.log('Mandou oi');

    await talk.waitCommands();

    await talk.send("Beleza, to saindo!");
    await driver.sleep(timers.exitingWait);

  } catch (e) {
    console.log(e);
  } finally {
    
    await driver.quit();
  }
});

start();