const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const { error } = require('console');

// Tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID: "759935914855-cu98himu6btu1m2uccug0cq28li9iudd.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:5000/user/auth/google/callback"
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
