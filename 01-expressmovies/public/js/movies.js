let deleteBtns = document.querySelectorAll('.deleteBtn');
function deleteMovie(res){
    var elmData = res.srcElement.dataset;
    if (confirm("Voulez-vous vraiment supprimer le film " + elmData.movietitle)) {
        var query = `/movie-details/${elmData.id}`;
        axios.delete(query)
        .then((res)=>{
            window.location.reload();
        }).catch((err)=>{
            console.error(err);
        })
    }
    
};
for(var index in deleteBtns){
    var item =  deleteBtns[index];
    if(!isNaN(index)){
        item.addEventListener("click", deleteMovie);
    }
};
