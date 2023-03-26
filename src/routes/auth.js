const express = require('express');
const authController = require('./auth/auth.controller');
const passport = require('passport');

const auth = express.Router();

// This is our first route  AIzaSyBqLGmzH5TXLzZSCyRHnER42xK7TpogPUE
//Client Secret : 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
//client ID : 23913833068-4u4ueqn3828nil8nggitlkrjls48r5ck.apps.googleusercontent.com
auth.get("/google", passport.authenticate('google', { scope: ['email'] }));

auth.get("/google/callback", passport.authenticate('google', {
    failureRedirect: '/failure',
    successRedirect: '/v1/launches', 
    session: true,
}), (req, res) => {
    console.log("Goolge callback");
   // res.redirect();
}); // TODO: add callback

auth.get("/logout", authController.logout);
auth.get("/failure", (req, res) => {
    return res.send('Failed to Log in');
});

module.exports = auth;
