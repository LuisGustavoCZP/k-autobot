const express = require("express");
const Superflix = require("./superflix");

const app = express();

const persistence = {
    searchs: {},
    selections: {},
};

function getPersistent (type, name, forced, res)
{
    const p = persistence[type][name];
    if(!forced && p) 
    {
        res.json(p);
        return true;
    }
    return false;
}

function setPersistent (type, name, data)
{
    const p = persistence[type];
    p[name] = data;
    const keys = Object.keys(p);
    while(keys.length > 20)
    {
        delete p[keys[0]];
    }
}

app.get("/search", async (req, res) => 
{
    const { title, f } = req.query;

    if(getPersistent("searchs", title, f, res)) return;

    const superflix = new Superflix();
    await superflix.start();

    let results;
    const sTitle = title.replace(/_/gi, " ").trim(); 

    if(sTitle) results = await superflix.search(sTitle);
    await superflix.quit();

    setPersistent("searchs", title, results);

    res.json(results);
});

app.get("/select", async (req, res) => 
{
    const { url, f } = req.query;

    if(getPersistent("selections", url, f, res)) return;

    const superflix = new Superflix();
    await superflix.start();

    let result;
    const completeUrl = url;//`https://seriesflixtv3.vip/${url}`; 

    if(completeUrl) result = await superflix.select(completeUrl);
    await superflix.quit();

    setPersistent("selections", url, result);

    res.json(result);
});

app.get("/watch", async (req, res) => 
{
    const { url, f } = req.query;
    

});

app.use(express.static(__dirname + '/public'));

app.listen(8000, ()=>{console.log("Servidor iniciado! http://localhost")})