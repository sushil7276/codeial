const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

// authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email',
},
    async function (email, password, done) {

        // find a user and establish the identity
        const user = await User.findOne({ email: email })
            .catch((err) => {
                console.log('Error in finding user --> Passport')
                return done(err);
            });

        if (!user || user.password != password) {
            console.log('Invalid Username/Password');
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
    return res.redirect('/user/sign-in');
}

passport.setAuthenticatedUser = function (req, res, next) {

    if (req.isAuthenticated()) {
        // req.user contains the current signed in user from the session cookie and we are sending this to the locals for the views
        res.locals.user = req.user;
    }

    next();
}


module.exports = passport;