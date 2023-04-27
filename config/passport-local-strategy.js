const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

// authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    // req call back funtion allow this method and 1st arg. is (req)
    passReqToCallback: true
},
    async function (req, email, password, done) {

        // find a user and establish the identity
        const user = await User.findOne({ email: email })
            .catch((err) => {
                req.flash('error', err)
                // console.log('Error in finding user --> Passport')
                return done(err);
            });

        if (!user || user.password != password) {
            req.flash('error', 'Invalid Username/Password')
            // console.log('Invalid Username/Password');
            return done(null, false);
        }

        return done(null, user);
    }
));

// serializing the user to decide wich key is to be kept in the cookies
passport.serializeUser(function (user, done) {
    done(null, user.id);
});


// deserializing the user from the key in the cookies
passport.deserializeUser(function (id, done) {
    const userId = User.findById(id)
        .catch((err) => {

            console.log('Error in finding user --> Passport')
            return done(err);
        })

    return done(null, userId);
});


// Check if the user is acthenticated
passport.checkAuthentication = (req, res, next) => {
    // If the user is sign in, Then pass on the request to the next function (controller's action)
    if (req.isAuthenticated()) {
        return next()
    }

    // If the user is no signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = async function (req, res, next) {

    if (req.isAuthenticated()) {
        // req.user contains the current signed in user from the session cookie and we are sending this to the locals for the views
        res.locals.user = await req.user;
    }

    next();
}


module.exports = passport;