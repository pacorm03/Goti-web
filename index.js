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
var possibleId = [];
var videogameIndex = 0;
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
  console.log("RESULTADO: "  +  videogameData);
  res.json(videogameData);
})

app.post("/review", async (req, res) => {
  //const name = req.body.videogameSearched;
  let name = "";
  if(possibleTitles.length > 1){
     name =  searchShortestTitle(possibleTitles);
    console.log("Shortest:" + name);

  }else{
     name = req.body.videogameSearched;
      console.log(name);
  }


  try {
    console.log(possibleId[videogameIndex]);
    const videogameData = await searchVideogame(possibleId[videogameIndex]);
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

function searchShortestTitle(titleArray){
  let shortTitle = "";
  let actualTitle = "";
  let actualIndex = 0;
  titleArray.forEach(element => {
    if(element === titleArray[0]){
      shortTitle = element;
      actualTitle = element;
      actualIndex = 0;
    }else{
      actualIndex++;
      actualTitle = element;
      if(actualTitle.length < shortTitle.length){
        videogameIndex = actualIndex;
        shortTitle = actualTitle;
      }
    }
    console.log("Short title: " + shortTitle + " " + shortTitle.length);
  });
  return shortTitle;
}
async function searchVideogameTitle(name){
let rawQueryString = `fields name, id;search "${name}" ;where version_parent = null; limit 4;`;
    const response = await axios.post(
      API_URL + "games",
      rawQueryString,
      config,
    );
    possibleTitles = response.data.map(element => element.name);
    possibleId = response.data.map(element => element.id);
    console.log(possibleTitles);
    console.log(possibleId);
    return possibleTitles
}

async function searchVideogame(id){
    let rawQueryString = `fields name, cover ;where id = ${id};`;

    const response = await axios.post(
      API_URL + "games",
      rawQueryString,
      config,
    );

    console.log(response.data[0]);

    return [response.data[0].name, response.data[0].cover];
}

async function searchArtwork(coverID) {
    let rawCoverQueryString = `fields image_id ;where id = ${coverID};`;

    const response_cover = await axios.post(
      API_URL + "covers",
      rawCoverQueryString,
      config,
    );

    const imageID = response_cover.data[0].image_id;

    return `https://images.igdb.com/igdb/image/upload/t_cover_big/${imageID}.jpg`;
}
