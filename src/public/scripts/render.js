import { Serie } from "../pages/series.js";

const main = document.body.querySelector("main");

function results (list)
{
    main.innerHTML = '';
    const ul = document.createElement("ul");
    ul.classList.add("search-results");

    list.forEach(element => 
    {
        const li = document.createElement("li");
        li.setAttribute("value", element.url);
        const img = document.createElement("img");
        img.src = element.image;
        li.appendChild(img);
        const title = document.createElement("h3");
        title.innerText = element.title;
        li.appendChild(title);
        li.addEventListener("click", () => 
        {
            main.innerHTML = '';
            const serie = document.createElement("view-serie");
            serie.src = element.url;
            main.appendChild(serie);
        })

        ul.appendChild(li);
    });
    main.appendChild(ul);
}

export default { results }