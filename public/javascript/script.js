var searchTitle = "";

$("#videogameInputSearch").on("keypress",(event) =>{
    sendInputSearch(event.key);
});

function sendInputSearch(key){
    searchTitle += key;
    console.log(searchTitle);
    //client to server request 
    $.ajax({
    url: "/search-game",
    method: "POST",
    data: { name: searchTitle },

    success: function(videogameData) {

        $("#datalistOptions").empty();

        videogameData.forEach(element => {
            $("#datalistOptions").append(
                `<option value="${element}">`
            );
        });

    }
});
    return searchTitle //string
}