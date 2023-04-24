const { Model } = require('mongoose');
const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async (req, res) => {

    // finding post id by name in html page
    let post = await Post.findById(req.body.post)

    // Finding user object which one is sign in
    let userId = await req.user;

    // if post id present then save comment
    if (post) {
        let comment = new Comment({
            content: req.body.content,
            post: req.body.post,
            user: userId.id
        })

        // save comment
        let saveComment = await comment.save()

        // comment push to post(array)
        post.comments.push(saveComment);
        // post save adding comment
        await post.save();
        res.redirect('/')

    }
}

// Delete comment
module.exports.distroy = async (req, res) => {

    // finding comment id
    let comment = await Comment.findById(req.params.id);

    
    // Finding user object which one is sign in
    let userId = await req.user;
    if (comment.user == userId.id) {
        let postId = comment.post;
      
        // delete comment
        await comment.deleteOne();

        // Also delete comment on postDB
        await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } })
            .then(() => res.redirect('back'))
    }
    else {
        return res.redirect('back');
    }

}