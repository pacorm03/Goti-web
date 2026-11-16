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
/*
function searchVideogame(name){
let rawQueryString = `fields name, artworks ;search "${name}" ;where version_parent = null;`;
    const response = await axios.post(
      API_URL + "games",
      rawQueryString,
      config,
    );
    console.log(response.data[0].name);
    console.log(response.data[0].artworks);
    return [response.data[0].name, response.data[0].artworks]
}
*/
app.post("/review", async (req, res) => {
  const name = req.body.videogameSearched;
  console.log(name);
  try {
    let rawQueryString = `fields name, artworks ;search "${name}" ;where version_parent = null;`;
    const response = await axios.post(
      API_URL + "games",
      rawQueryString,
      config,
    );
    console.log(response.data[0].name);
    console.log(response.data[0].artworks);

    //Search Videogame Name
    const videogameName = response.data[0].name;
    const artworkID = response.data[0].artworks;

    let rawArtworkQueryString = `fields image_id ;where id = ${artworkID};`;

    //Search Artwork
    const response_artwork = await axios.post(
      API_URL + "artworks",
      rawArtworkQueryString,
      config,
    );

    console.log(response_artwork.data);

    const imageID = response_artwork.data[0].image_id;
    const imageURL = `https://images.igdb.com/igdb/image/upload/t_cover_big/${imageID}.jpg`;
    console.log(imageURL);

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
