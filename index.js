require('dotenv').config();
const express = require('express');
const env = require('./config/environment');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();


const expressLayout = require('express-ejs-layouts');

// MongoDB imported
const db = require('./config/mongoose');

// used for session cookie
const session = require('express-session');

// Import passport authentication
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

const { default: mongoose } = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const costumeMWare = require('./config/middleware');

// Setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(process.env.CHAT_PORT);
console.log(`Chat Server is listening on port ${process.env.CHAT_PORT}`)


// Mongodb middleware
app.use(express.urlencoded({ extended: false }));

// Store cookie
app.use(cookieParser());


app.use(express.static(env.asset_path));

// Make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode, env.morgan.options))

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
    secret: env.session_cookie_key,
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
app.use(costumeMWare.setFlash);

// after middleware router will execute
// use express router 
app.use('/', require('./routes'));

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(`Error: ${err}`);
    }

    console.log(`Server running Port: ${process.env.PORT}`)
})