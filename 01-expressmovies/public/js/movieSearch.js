const API_KEY = "c066ea1711c7184cfd4172f2a2cc29c5";
let btnSearch = document.querySelector('button');
btnSearch.addEventListener('click', search);
let resultDiv = document.querySelector('.result');
function search(){
    let searchText = document.querySelector('input').value;
    const query = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchText}&language=fr-FR`;
    axios.get(query)
    .then((res)=>{
        displayResultat(res.data.results);
    })
};
function displayResultat(movies){
    resultDiv.innerHTML = "";
    for(let index in movies){
            const film = movies[index];
            const title = film.title;
            const year = film.release_date.split('-')[0];
            const resume = film.overview;
            console.log();
            let element = document.createElement('div');
            element.innerHTML = title + ' - ' +year;
            resultDiv.appendChild(element);
        }
}