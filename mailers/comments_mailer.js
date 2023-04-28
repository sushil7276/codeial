const nodemailer = require('../config/nodemailer');
const User = require('../models/user');
const Post = require('../models/post');

// this is another way of exporting a metod
exports.newComment = async (comment) => {

    let htmlString = nodemailer.renderTemplate({ comment: comment }, '/comments/new_comments.ejs')

    // Post id (which post are you comment find thi user mail id)
    let postid = await Post.findById(comment.post);
    let postEmail = await User.findById(postid.user)
    
    // who comment this email id find
    let user = await User.findById(comment.user);
    
    nodemailer.transporter.sendMail({
        // "less secure apps" ON in this account then try
        from: user.email,
        to: postEmail.email,
        // to:"shil7276@gmail.com",
        subject: "New Comment Published!",
        html: htmlString
    }, (err, info) => {
        if (err) {
            console.log('Error in sending mail ("less secure apps" ON in this account then try) : ', err);
            return;
        }

        console.log("Message sent", info);
        return;
    });
}