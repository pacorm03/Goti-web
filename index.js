import express from "express";
import axios from "axios";
import apicalypseModule from "apicalypse";

const app = express();
const apicalypse = apicalypseModule.default;
const port = 3000;
const ClientID = "i0lhntltqjixl3elb51f5cvpcz4rkx";
const bearerToken = "Bearer 8oiju0q1jujtwbib4roauvxo2ry5g5";
const API_URL = "https://api.igdb.com/v4/";
const config = {
  headers: { "Client-ID": ClientID, Authorization: bearerToken },
};

const rawQueryString = 'fields *;search "Halo";where version_parent = null;';

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

const requestOptions = {
    queryMethod: 'url',
    method: 'post', // The default is `get`
    baseURL: API_URL,
    headers: config.headers,
    responseType: 'json',
    timeout: 1000, // 1 second timeout
};


app.get("/review", async (req, res) => {
  try {

    const query = apicalypse(requestOptions)
    .fields("name")
    .limit(10);

    const response = await axios.post(
    API_URL + "games",
    "fields name; limit 10;",
    {
        headers: {
            "Client-ID": ClientID,
            Authorization: bearerToken,
            "Content-Type": "text/plain"
        }
    }
);

console.log(response.data);
/*
console.log(query);
    console.log(API_URL + "games", config);
    //const result = await axios.get(API_URL + "games",config);
    const response = await apicalypse(requestOptions)
.fields("*")
.where("version_parent = null")
.request("games");

console.log(response.data);
*/
    const gameReview = {
      name: "",
    };
    res.render("./review.ejs", {
      game: gameReview,
    });
  } catch (err) {
console.log("Status:", err.response?.status);
    console.log("Data:", err.response?.data);
    console.log("Message:", err.message);
    console.log("Cause:", err.cause);  }
});
