const https = require("https");
const { consumerKey, consumerSecret } = require("./secrets");

// this is an async process and will take some time to complete!
// we're passing a callback to this function so that we can handle the order of operations!
module.exports.getToken = function () {
    // this function is responsible for getting the bearerToken from Twitter
    // we will do this together in class <3

    return new Promise((resolve,reject) => {

        let creds = `${consumerKey}:${consumerSecret}`;
        let encodedCreds = new Buffer.from(creds).toString("base64");

        const options = {
            host: "api.twitter.com",
            path: "/oauth2/token",
            method: "POST",
            headers: {
                Authorization: `Basic ${encodedCreds}`,
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            }
        };

        // options - obj that has info about the request we're about to make
        // cb - callback specific to our https request that runs WHEN the request is completed
        const req = https.request(options, cb);
        req.end("grant_type=client_credentials");

        // this cb fn will run once the https request is finished!
        function cb(resp) {
            if (resp.statusCode != 200) {
                reject(resp.statusCode);
            }

            // if we get to this point, everything went well!! 
            // we got some data back!!
            let body = "";
            resp.on("data", (chunk) => {
                body += chunk;
            }).on("end", () => {
                // console.log("body in twitter.js: ", body);
                let parsedBody = JSON.parse(body);
                // console.log("parsedBody: ", parsedBody);
                resolve(parsedBody.access_token);
            });
        }
    });
};

// this is an async process and will take some time to complete!
// we're passing a callback to this function so that we can handle the order of operations!
module.exports.getTweets = function (bearerToken) {
    // this function is responsible for getting tweets from Twitter's API
    // each request that we make for tweets, we HAVE to do it with the token (this token tells Twitter that we're super verified)
    // this function will be for you to complete :)

    return new Promise((resolve,reject) => {

        const options = {
            host: "api.twitter.com",
            path: "/1.1/statuses/user_timeline.json?screen_name=TheOnion&tweet_mode=extended",
            method: "GET",
            headers: {
                Authorization: "Bearer " + bearerToken
            }
        };

        function cb(resp) {
            if (resp.statusCode != 200) {
                reject(resp.statusCode);
            }

            // if we get to this point, everything went well!! 
            // we got some data back!!
            let body = "";
            resp.on("data", (chunk) => {
                body += chunk;
            }).on("end", () => {
                // console.log("body in twitter.js: ", body);
                resolve(body);
            });
        }

        const req = https.request(options, cb);
        req.end("grant_type=client_credentials");
    });
};

// this is a synchronous process
module.exports.filterTweets = function (tweets) {
    // once we have tweets from twitter, this fn is responsible for cleaning / filtering the tweets up!
    // this function will be for you to complete :)

    //convert from JSON into JS object
    tweetsObj = JSON.parse(tweets);

    
    let newsUrlArray = [];

    tweetsObj.forEach(function(obj) {

        let newsUrlObj = {};
        
        let textSplit =  obj.full_text.split(' ');
        // find where the first & only link exists within the text
        let found = textSplit.find(elem => elem.includes('https:'));
        // get its index
        let foundIndex = textSplit.indexOf(found);
        // we consider when only 1 link exists at the end >>means that>> foundIndex must be the last array index
        if(foundIndex === textSplit.length-1) {
            // clean the text from this link
            newsUrlObj.text =  obj.full_text.replace(found, "");
            // save the link to be used in ticker
            newsUrlObj.url = found;
            // append the array of objects storing our news
            newsUrlArray.push(newsUrlObj);
        }

    });
    // console.log("news array", newsUrlArray);
    return newsUrlArray;
};