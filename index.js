const express = require('express')
const cookieParser = require('cookie-parser');
const app = express();
const port = 5000;

const expressLayout = require('express-ejs-layouts');

// MongoDB imported
const db = require('./config/mongoose');

// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const { default: mongoose } = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const custumMware = require('./config/middleware');

// Mongodb middleware
app.use(express.urlencoded());

// Store cookie
app.use(cookieParser());


app.use(express.static('./assets'));

// Make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(expressLayout);

// Extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set("layout extractScripts", true)


// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store the session cookie in the db
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: 'blashsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: 'disabled'
        },
        function (err) {
            console.log(err || 'Connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser)

// flash messages
app.use(flash());
app.use(custumMware.setFlash);

// after middleware router will exicute
// use express router 
app.use('/', require('./routes'));

app.listen(port, (err) => {
    if (err) {
        console.log(`Error: ${err}`);
    }

    console.log(`Server running Port: ${port}`)
})