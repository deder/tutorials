const form = document.querySelector('form');
function addMovie(){
   event.preventDefault();
   if(fetch){
       fetch("/movies",{
           method: 'POST',
           body: new FormData(form)
       })
       .then(checkStatus)
       .catch((err)=>{
           console.error(err);
       });
   }

};
function checkStatus(response){
   if(response.status >= 200 && response.status <300){
       let newMovieDiv = document.createElement('div');
       const movieTitle = document.querySelector('input.movieTitle').value;
       const movieYear = document.querySelector('input.movieYear').value;
       newMovieDiv.innerHTML = ` ${movieTitle} - ${movieYear}`;
       document.querySelector('.frenchMovies').appendChild(newMovieDiv);
       form.reset();
   }

}
form.addEventListener('submit', addMovie);