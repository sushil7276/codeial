const Post = require('../models/post');
const Comment = require('../models/comment');



module.exports.create = async (req, res) => {

    try {

        // find user id
        let userId = await req.user;

        const postSave = new Post({
            content: req.body.content,
            user: userId.id
        })

        // save post in DB
        await postSave.save()
            .catch(() => console.log('Posting Error..'))

        if (req.xhr) {
            return res.status(200).json({
                data: {
                    post: postSave
                },
                message:"Post Created"
            })
        }

        req.flash('success', "Post Created Successfully")
        return res.redirect('back');


    } catch (error) {
        req.flash('error', error)

        return res.redirect('back');
    }

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

            req.flash('success', "Delete Post successfully");
            return res.redirect('back');
        }
        else {
            return res.redirect('back');
        }

    } catch (error) {
        req.flash('error', error);
        return res.redirect('back');
    }


}