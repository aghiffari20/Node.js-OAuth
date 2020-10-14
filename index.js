// Import the express lirbary
const express = require("express");

// Import the axios library, to make HTTP requests
const axios = require("axios");
const http = require("http");
const https = require("https");
const fs = require("fs");

var key = fs.readFileSync("selfsigned.key");
var cert = fs.readFileSync("selfsigned.cr");
var oprtions = {key: key, cert: cert};

var serve = http.createServer(app);
var server = https.createServer(options, app);
// This is the client ID and client secret that you obtained
// while registering the application
const clientID = "192f7dbf7e751574b0e3";
const clientSecret = "7184f32e008282f583e414bd3325b2f04ae618f6";

// Create a new express application and use
// the express static middleware, to serve all files
// inside the public directory
const app = express();
app.use(express.static(__dirname + "/public"));

app.get("/oauth/redirect", (req, res) => {
    // The req.query object has the query params that
    // were sent to this route. We want the `code` param
    const requestToken = req.query.code;
    axios({
        // make a POST request
        method: "post",
        // to the Github authentication API, with the client ID, client secret
        // and request token
        url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
        // Set the content type header, so that we get the response in JSOn
        headers: {
            accept: "application/json",
        },
    }).then((response) => {
        // Once we get the response, extract the access token from
        // the response body
        const accessToken = response.data.access_token;
        // redirect the user to the welcome page, along with the access token
        res.redirect(`/welcome.html?access_token=${accessToken}`);
    });
});

// Start the server on port 8090
app.listen(8090);
