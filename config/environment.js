require('dotenv').config();
const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory

})


const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'blashsomething',
    db: 'codeial_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        // Which id used in sending mail (this credential are put here) pass is (app pass key)
        auth: {
            user: 'sushilbabar123@gmail.com',
            pass: 'oveualawbbitaywx'
        }
    },
    google_client_ID: "759935914855-cu98himu6btu1m2uccug0cq28li9iudd.apps.googleusercontent.com",
    google_client_Secret: "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",
    google_callback_URL: "http://localhost:5000/user/auth/google/callback",
    jwt_secret_key: 'codeial',
    morgan: {
        mode: 'dev',
        options: { stream: accessLogStream }
    }
}

const production = {
    name: 'production',
    asset_path: process.env.CODEIAL_ASSET_PATH,
    session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
    db: process.env.CODEIAL_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        // which id used in sending mail (this credential are put here) pass is (app pass key)
        auth: {
            user: process.env.CODEIAL_GMAIL_USERNAME,
            pass: process.env.CODEIAL_GMAIL_PASSWORD
        }
    },
    google_client_ID: process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_client_Secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_callback_URL: process.env.CODEIAL_GOOGLE_CALLBACK_URL,
    jwt_secret_key: process.env.CODEIAL_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: { stream: accessLogStream }
    }
}



module.exports = eval(process.env.CODEIAL_ENVIRONMENT) == undefined ? development : eval(process.env.CODEIAL_ENVIRONMENT);