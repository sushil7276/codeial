const Post = require('../../../models/post');
const Comment = require('../../../models/comment');


module.exports.index = async function (req, res) {

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

    return res.json(200, {
        message: "List of posts",
        posts: post
    })
}


module.exports.destroy = async (req, res) => {

    try {

        // finding postId
        let postId = await Post.findById(req.params.id);

        // Finding userId
        let userId = await req.user;

        if (postId.user == userId.id) {

            await postId.deleteOne();

            // also also all comments deleted
            await Comment.deleteMany({ post: req.params.id });

            return res.json(200, {
                message: "Post and associated comments deleted successfully!"
            })
        }
        else {
            return res.json(401, {
                message: "You can not delete this post"
            })
        }

    } catch (error) {

        console.log("******Error: ", error);
        return res.json(500, {
            message: "Internal Server Error"
        })
    }

}