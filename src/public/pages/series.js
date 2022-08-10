import { ViewHeader } from "../components/view-header.js";

class Serie extends HTMLElement
{
    #source;
    #data;

    constructor ()
    {
        super();
        this.#source = '';
        this.#data = null;
    }

    get src ()
    {
        return this.#source;
    }

    set src (src)
    {
        this.#source = src;
        this.update();
    }

    async update ()
    {
        console.log("Updating", this.#source);
        
        this.innerHTML = '';
        this.#data = await fetch(`/select?url=${this.#source}`).then(resp => resp.json()).catch(err => {console.log(err); return null;});
        
        console.log(this.#data);

        this.create();
    }

    create ()
    {
        this.setAttribute("value", this.#data.info.url);
        const header = document.createElement("view-header");
        header.data = this.#data.info;
        this.appendChild(header);

        const seasons = document.createElement("ul");
        seasons.classList.add("seasons");
        for (const seasonData of this.#data.seasons)
        {
            const season = document.createElement("li");
            
            const sTitle = document.createElement("h3");
            sTitle.innerText = `Temporada ${seasonData.id}`;
            season.appendChild(sTitle);

            const episodes = document.createElement("ul");
            episodes.classList.add("episodes");
            for (const episodeData of seasonData.episodes)
            {
                const episode = document.createElement("li");
                
                const eImage = document.createElement("img");
                eImage.src = episodeData.image;
                episode.appendChild(eImage);

                const eTitle = document.createElement("h4");
                eTitle.innerText = `Episodio ${episodeData.id}`;
                episode.appendChild(eTitle);

                episodes.appendChild(episode);
            }
            season.appendChild(episodes);

            seasons.appendChild(season);
        }

        this.appendChild(seasons);
    }
}

customElements.define('view-serie', Serie);

export { Serie };