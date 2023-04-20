const express = require('express')
const cookieParser = require('cookie-parser');
const app = express();
const port = 5000;

// MongoDB imported
const db = require('./config/mongoose');

// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

// Mongodb middleware
app.use(express.urlencoded());

// Store cookie
app.use(cookieParser());

const expressLayout = require('express-ejs-layouts');

app.use(express.static('./assets'));
app.use(expressLayout);

// Extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set("layout extractScripts", true)


// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');


app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: 'blashsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser)

// after middleware router will exicute

// use express router 
app.use('/', require('./routes'));

app.listen(port, (err) => {
    if (err) {
        console.log(`Error: ${err}`);
    }

    console.log(`Server running Port: ${port}`)
})