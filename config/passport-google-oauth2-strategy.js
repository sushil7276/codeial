const passport = require('passport');
const env = require('./environment');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const { error } = require('console');

// Tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID: env.google_client_ID,
    clientSecret: env.google_client_Secret,
    callbackURL: env.google_callback_URL
},

    async function (accessToken, refreshToken, profile, done) {

        // Find a user
        let user = await User.findOne({ email: profile.emails[0].value })
            .catch((error) => { console.log("Error in google strategy-passport", error) })

        // In consle get profile details
        // console.log(profile)



        if (user) {
            // If found, set this user as req.user
            return done(null, user);
        }
        else {
            // if not found, Create the user and set it as req.user
            let userInfo = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                passport: crypto.randomBytes(20).toString('hex')
            })

            await userInfo.save()
                .catch((error) => { console.log("Error in google strategy-passport", error) })

            return done(null, userInfo)

        }
    }

));


module.exports = passport;
