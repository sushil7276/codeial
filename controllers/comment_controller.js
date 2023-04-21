const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async (req, res) => {

    // finding post id by name in html page
    let post = await Post.findById(req.body.post)

    // if post id present then save comment
    if (post) {
        let commnet = new Comment({
            content: req.body.content,
            post: req.body.post,
            user: req.user._id
        })

        // save comment
        let saveComment = await commnet.save()

        // comment push to post(array)
        post.comments.push(saveComment);
        // post save adding comment
        await post.save();
        res.redirect('/')

    }
}