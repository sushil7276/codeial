const express = require('express')
const cookieParser = require('cookie-parser');
const app = express();
const port = 5000;

// MongoDB imported
const db = require('./config/mongoose');

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

// use express router 
app.use('/', require('./routes'));


// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');


app.listen(port, (err) => {
    if (err) {
        console.log(`Error: ${err}`);
    }

    console.log(`Server running Port: ${port}`)
})