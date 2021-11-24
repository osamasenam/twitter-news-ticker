const express = require("express");
const app = express();
const { getToken, getTweets, filterTweets } = require("./twitter");

app.use(express.static("./ticker"));

// this url needs to match your ajax url in your script.js
// your server is now responsible for sending the json data back to ticker!!!
app.get("/links.json", (req, res) => {
    console.log("request for json has been made!!!");

    // There will be 4 things we want to do in here:
    // 1. get the bearer token
    getToken().then((bearerToken) => {
        // at this point, getToken has FINISHED and we have access to the token
        console.log("bearerToken in server.js!! ", bearerToken);

        // 2. with the token, make a request for tweets
        getTweets(bearerToken).then((tweets) => {
            /// at this point, everything went well and tweets should be defined!!!
            // console.log("tweets in index.js! ", tweets);

            // // 3. once we receive the tweets, filter them
            const filteredTweets = filterTweets(tweets);
            // console.log("tweets:", filteredTweets);

            // // 4. send filtered tweets to the client (script.js) as json
            // no need to use stringify() here
            res.json(filteredTweets);
        })
        .catch((err) => {
            console.log("err in getTweets: ", err);
        })
    })
    .catch((err) => {
        console.log("err in getToken: ", err);
    });
   
});

app.listen(8080, () => console.log("twitter api server listening...."));