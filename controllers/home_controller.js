const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async (req, res) => {

    try {
        // Populate the user of each post
        const post = await Post.find({})
        .sort('-createdAt')
            .populate('user')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user'
                }
            });

        // creating user profile links
        let user = await User.find({})

        return res.render('home', {
            title: "Codeial | Home",
            post,
            all_users: user
        });

    } catch (error) {
        console.log('Error: ', error)
    }


}