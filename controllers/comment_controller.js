const { Model } = require('mongoose');
const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');
const Like = require('../models/like');


module.exports.create = async (req, res) => {

    try {

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

            // comment push to post(array)
            post.comments.push(comment);

            // post save adding comment
            await post.save();

            // save comment
            // let saveComment = await comment.save()
            let saveComment = await comment.save();


            // commentsMailer.newComment(saveComment);
            let job = queue.create('emails', comment).save()

            console.log('job enqueued', job.id)

            if (req.xhr) {

                return res.status(200).json({
                    data: {
                        comment: saveComment
                    },
                    message: "Post Created"
                })
            }

            req.flash('success', "Comment Created Successfully")
            res.redirect('/')

        }

    } catch (error) {
        req.flash('Error: ', error);
    }
}

// Delete comment
module.exports.distroy = async (req, res) => {

    try {

        // finding comment id
        let comment = await Comment.findById(req.params.id);

        // Finding user object which one is sign in
        let userId = await req.user;
        if (comment.user == userId.id) {
            let postId = comment.post;

            // delete comment
            await comment.deleteOne();

            // Also delete comment on postDB
            await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });

            // Change :: destroy the associated likes for this comment
            await Like.deleteMany({ likeable: comment._id, onModel: 'Comment' });

            // send the comment id which was deleted back to the views
            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }


            req.flash('success', "Comment Deleted Successfully")
            return res.redirect('back');
        }
        else {

            return res.redirect('back');
        }


    } catch (error) {
        req.flash('Error', error)
        console.log('Error: ', error);
    }


}