function get ()
{
    const stringParams = location.hash?location.hash.slice(1).split("&"):[];
    const filters = stringParams.reduce((p, c) => 
    {
        const filter = c.split("=");
        if(filter.length == 2 && filter[1])
        {
            p[filter[0]] = decodeURI(filter[1].trim());
        }
        return p;
    }, {});
    //console.log(filters);//stringParams, 
    return filters;
}

function set (name, value)
{
    const hashPart = value?`${name}=${value.replace(/\s/gi, "_")}`:'';

    let regex = new RegExp(`^(#${name}=\\w*&)`, 'gm');
    if(regex.test(location.hash))
    {
        //console.log("Inicio", location.hash);
        location.hash = location.hash.replace(regex, hashPart?`#${hashPart}&`:'');
        return;
    }

    regex = new RegExp(`(&${name}=\\w*&)`, 'gm');
    if(regex.test(location.hash)) 
    {
        //console.log("Meio", location.hash);
        location.hash = location.hash.replace(regex, hashPart?`&${hashPart}&`:'');
        return;
    }

    regex = new RegExp(`(&${name}=\\w*)$`, 'gm');
    if(regex.test(location.hash)) 
    {
        //console.log("Fim", location.hash);
        location.hash = location.hash.replace(regex, hashPart?`&${hashPart}`:'');
        return;
    }

    regex = new RegExp(`^(#${name}=\\w*)$`, 'gm');
    if(regex.test(location.hash)) 
    {
        //console.log("Unico", location.hash);
        location.hash = location.hash.replace(regex, hashPart?`#${hashPart}`:'');
        return;
    }

    if(!hashPart) return;
    
    if(location.hash.length > 1) location.hash = `${location.hash}&${hashPart}`;
    else location.hash = `${hashPart}`;
}

function querify ()
{
    const strings = Object.entries(filters).map((entry) => `${entry[0]}=${entry[1]}`);
    return strings.join("&");
}

let filters;
async function check (callback, forced=false)
{
    filters = get();
    if(!filters.search) return;

    const results = await fetch(`/search?title=${filters.search}${forced?'&f=1':''}`).then(resp => resp.json()).catch(err => {console.log("Error", err); return []});
    console.log(results);

    if(callback) callback(results);
}

export default { get, set, querify, check };
