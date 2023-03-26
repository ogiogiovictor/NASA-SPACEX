const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

//Passport implementation
const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');

//Cookie Implementation
const cookieSession = require('cookie-session');

//.env file implementation
require('dotenv').config();

//Router Middleware
const api = require('./routes/api');
const authRouter = require('./routes/auth');

//This is the express app
const app = express();

//Google Audthentication Login
const config = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    COOKIE_KEY: process.env.COOKIE_KEY,
    COOKIE_KEY2: process.env.COOKIE_KEY2,
}

const AUTH_OPTIONS = {
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
};

function verifyCallback(accessToken, refreshToken, profile, done) { 
    console.log('Google Profile ', profile);
    done(null, profile);
}
//passport strategy initialization implementation before use the strategy
passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

//This is a middleware that serializes the user. Save the session to the cookie
passport.serializeUser((user, done) => {
   // done(null, user);
    done(null, user);
 });

//This is a middleware that deserializes the user. Reading/Loading the session from the cookie
passport.deserializeUser((user, done) => { 
   // User.findById(id).then(user => { done(null, user) });
    done(null, user);
})

//This is a middleware that allows cross origin requests
app.use(cors({
    origin: 'http://localhost:3000'
}));

//This is a middleware that logs the request
app.use(morgan('combined'));

//This is a middleware that sets security headers
app.use(helmet());

//This is a middleware that sets cookies
app.use(cookieSession({ 
    name: 'session',
    maxAge: 24 * 60 * 60 * 1000,
    keys: [config.COOKIE_KEY, config.COOKIE_KEY2]
}));

//This helps secure the app. Passport is a middleware that helps with authentication
app.use(passport.initialize());
app.use(passport.session());

//This is a middleware that parses the request body
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

//Check if a user is logged
function checkLoggedin(req, res, next) { //req.user
    console.log("Current User: ", req.user);
    const isLogged = req.isAuthenticated() && req.user;
    if(!isLogged) {
        return res.status(401).json({message: "You are not logged in"});
    }else{
        next();
    }
};

//Route Middleware
app.use('/auth', authRouter);
app.use('/v1', checkLoggedin, api);




//This was done when dealing with react that was built in the server
app.get('/*', (req, res) => { 
    //res.json({message: "Hello World"});
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;