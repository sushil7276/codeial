const passport = require('passport');
const jWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'codeial',
}

passport.use(new jWTStrategy(opts, async function (jwtPayLoad, done) {

    const user = await User.findById(jwtPayLoad._id)
        .catch(() => console.log("Error in finding user from JWT"))

    if (user) {
        return done(null, user);
    }
    else {
        return done(null, false);
    }
}));


module.exports = passport;