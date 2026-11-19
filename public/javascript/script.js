var searchTitle = "";

$("#videogameInputSearch").on("input", (event) => {
  let inputText = $("#videogameInputSearch").val();
  sendInputSearch(inputText);
});

function sendInputSearch(key) {
  searchTitle = key;
  console.log("Input text: " + searchTitle);
  //client to server request
  $.ajax({
    url: "/search-game",
    method: "POST",
    data: { name: searchTitle },

    success: function (videogameData) {
      $("#datalistOptions").empty();

      videogameData.forEach((element) => {
        $("#datalistOptions").append(`<option value="${element}">`);
      });
    },
  });
  return searchTitle; //string
}

$("#datalistOptions").on("click", (event) => {
  $.ajax({
    url: "/review",
    method: "POST",
    data: { videogameSearched: $(this).val() },
  });
});
