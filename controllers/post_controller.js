const Post = require('../models/post');



module.exports.createComment = async (req, res) => {

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
