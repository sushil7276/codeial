const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');


let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    // Wichi id used in sending mail (this credential are put here) pass is (app pass key)
    auth: {
        user: 'sushilbabar123@gmail.com',
        pass: 'oveualawbbitaywx'
    }
})

let renderTemplate = (data, relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function (err, template) {
            if (err) { console.log("Error in rendering template", err); return }

            mailHTML = template;
        }
    )

    return mailHTML;
}

module.exports = {
    transporter,
    renderTemplate
}