const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var cors = require('cors');
var _ = require('underscore');
const {
    ObjectID
} = require("mongodb");
const multer = require("multer");
const passport = require("passport");

const carRoutes = require("./routes/car");
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
// const db = require('./config/keys').mongoURI;

//setting up express app
const app = express();




const port = process.env.PORT || 5000 //Configuring app to work remotly(Heroku) or locally
//DB config.
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/dzDB");

//passport middleware
app.use(passport.initialize());

//Passport config
require("./config/passport.js")(passport);

//body-parser middlewar
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json()); //to get the body of the request

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://afternoon-atoll-25236.herokuapp.com');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

function allowCrossDomain(req, res, next) {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    var origin = req.headers.origin;
    if (_.contains(app.get('allowed_origins'), origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    if (req.method === 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
}


app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://afternoon-atoll-25236.herokuapp.com');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use("/profile/cars", carRoutes); //Using carRoutes middleware( middleware - > code that runs between request and response)
app.use("/auth/users", userRoutes);
app.use("/profile", profileRoutes);

// if the user entered route that doesnt exist
app.use((req, res, next) => {
    res.status(404).json({
        msg: "U lost there is no route as u entered"
    });
});

app.listen(port, () => {
    console.log("we are now listening");
});