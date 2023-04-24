const Post = require('../models/post');

module.exports.home = async (req, res) => {

    // Populate the user of each post
    const post = await Post.find({})
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        }).exec()
    return res.render('home', {
        title: "Codeial | Home",
        post
    })
}