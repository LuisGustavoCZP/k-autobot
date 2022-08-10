class ViewHeader extends HTMLElement 
{
    #data;

    constructor ()
    {
        super();
        this.#data = '';
    }

    get data ()
    {
        return this.#data;
    }

    /**
     * 
     * @param {any} _data 
     */
    set data (_data)
    {
        this.#data = _data;

        const img = document.createElement("img");
        img.src = _data.image;
        this.appendChild(img);

        const container = document.createElement("div");
        this.appendChild(container);

        const title = document.createElement("h2");
        title.innerHTML = _data.title;
        container.appendChild(title);

        const h3 = document.createElement("h3");

        const category = document.createElement("span");
        category.classList.add("category");
        category.innerText = _data.category[0].toUpperCase() + _data.category.slice(1);
        h3.appendChild(category);

        const date = document.createElement("span");
        date.classList.add("date");
        date.innerText = _data.date;
        h3.appendChild(date);

        container.appendChild(h3);

        const origin = document.createElement("a");
        origin.href = _data.origin.url;
        origin.innerText = _data.origin.name;
        container.appendChild(origin);

        const genders = document.createElement("div");
        genders.classList.add("genders");
        _data.genders.forEach(genderData => 
        {
            const gender = document.createElement("a");
            gender.href = genderData.url;
            gender.innerText = genderData.name;
            genders.appendChild(gender);
        });
        container.appendChild(genders);
    }

}

customElements.define('view-header', ViewHeader);

export { ViewHeader }