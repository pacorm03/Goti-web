import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const ClientID = "i0lhntltqjixl3elb51f5cvpcz4rkx";
const bearerToken = "Bearer 8oiju0q1jujtwbib4roauvxo2ry5g5";
const API_URL = "https://api.igdb.com/v4/";
const config = {
  headers: { "Client-ID": ClientID, Authorization: bearerToken },
};
var possibleTitles = [];
//const rawQueryString = 'fields name;search "Halo";where version_parent = null; limit  1;';
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.listen(port, () => {
  console.log("Server running at port " + port);
});

app.get("/", (req, res) => {
  try {
    res.render("index.ejs");
  } catch (err) {
    console.log("Error: " + err);
  }
});



app.get("/review", (req, res) => {
  try {
    res.render("review.ejs");
  } catch (err) {
    console.log("Error: " + err);
  }
});

//Title search for datalist
app.post("/search-game", async (req,res)=>{
  const name = req.body.name;
  console.log(name);
  const videogameData = await searchVideogameTitle(name);
  console.log("RESULTADO:"  +  videogameData);
  res.json(videogameData);
})

app.post("/review", async (req, res) => {
  const name = req.body.videogameSearched;
  console.log(name);
  
  try {
    const videogameData = await searchVideogame(name);
    //Search Videogame Name
    const videogameName = videogameData[0];
    console.log(videogameName);
    //Search artwork
    const artworkID = videogameData[1];
    const imageURL = await searchArtwork(artworkID);
    const gameReview = {
      name: videogameName,
      imgURL: imageURL,
    };
    res.render("./review.ejs", {
      game: gameReview,
    });
  } catch (err) {
    console.log("Status:", err.response?.status);
    console.log("Data:", err.response?.data);
    console.log("Message:", err.message);
    console.log("Cause:", err.cause);
    res.redirect("/");
  }
});
async function searchVideogameTitle(name){
let rawQueryString = `fields name ;search "${name}" ;where version_parent = null; limit 4;`;
    const response = await axios.post(
      API_URL + "games",
      rawQueryString,
      config,
    );
    possibleTitles = response.data.map(element => element.name);

    console.log(possibleTitles);
    return possibleTitles
}

async function searchVideogame(name){
let rawQueryString = `fields name, artworks ;search "${name}" ;where version_parent = null;`;
    const response = await axios.post(
      API_URL + "games",
      rawQueryString,
      config,
    );
    return [response.data[0].name, response.data[0].artworks]
}



async function searchArtwork(artworkID) {
  let rawArtworkQueryString = `fields image_id ;where id = ${artworkID};`;

    //Search Artwork
    const response_artwork = await axios.post(
      API_URL + "artworks",
      rawArtworkQueryString,
      config,
    );

    console.log(response_artwork.data);

    const imageID = response_artwork.data[0].image_id;
    return  `https://images.igdb.com/igdb/image/upload/t_cover_big/${imageID}.jpg`;

}
