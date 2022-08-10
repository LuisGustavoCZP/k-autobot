import filters from "./filters.js";
import render from "./render.js";

const searchInput = document.getElementById("pesquisa-input");
const searchSubmit = document.getElementById("pesquisa-submit");

filters.check(render.results);

function search ()
{
    const text = searchInput.value;
    filters.set("search", text);
    filters.check(render.results, true);
}

searchInput.onkeydown = (e) =>
{
    var key = e.which || e.keyCode;
    if (key == 13) search ();
}

searchSubmit.onclick = () => search();

export { search };