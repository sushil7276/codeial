const Post = require('../models/post');
const Comment = require('../models/comment');



module.exports.create = async (req, res) => {

    // if we are alredy sign in then do not opent this page
    if (req.isAuthenticated()) {

        let userId = await req.user;
        const postSave = new Post({
            content: req.body.content,
            user: userId.id
        })

        await postSave.save()
            .catch(() => console.log('Posting Error..'))

        return res.redirect('back');

    }

    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}


module.exports.destroy = async (req, res) => {

    // finding postId
    const postId = await Post.findById(req.params.id);

    // Finding userId
    let userId = await req.user;
  
    if (postId.user == userId.id) {
        await postId.deleteOne();

        // also also all comments deleted
        await Comment.deleteMany({ post: req.params.id })
            .then(() => res.redirect('back'))
    }
    else {
        return res.redirect('back');
    }
}