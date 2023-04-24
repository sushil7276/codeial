const User = require("../models/user");


module.exports.profile = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        return res.render('user', {
            title: 'User Profile',
            profile_user: user
        })


    } catch (error) {
        console.log('Error: ', error);
    }


}

// Render the sign up page
module.exports.signUp = (req, res) => {

    try {

        // if we are alredy sign in then do not opent this page
        if (req.isAuthenticated()) {
            return res.redirect('/user/profile');
        }

        return res.render('user_sign_up', {
            title: "Codeial | Sign Up"
        })

    } catch (error) {
        console.log('Error: ', error);
    }


}

// Render the sign In page
module.exports.signIn = (req, res) => {

    // if we are alredy sign in then do not opent this page
    if (req.isAuthenticated()) {
        return res.redirect('/user/profile');
    }

    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

// Get the sign up data
module.exports.create = async (req, res) => {

    try {

        // checking password
        if (req.body.password != req.body.c_password) {
            return res.redirect('back');
        }

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })

        // Check Email is already present or not
        let userSave = await User.findOne({ email: user.email }).catch(() => console.log("Error in finding user in signing up"))


        // If user in not present then Create new user
        if (!userSave) {

            await user.save().then(() => res.redirect('/user/sign-in'))
                .catch(() => console.log('Error in creating user while signing up'))

        }
        else {
            console.log('User alredy Existed')
            return res.redirect('back');
        }

    } catch (error) {
        console.log('Error: ', error);
    }


}

// Sign in and create a session for ther user
module.exports.createSession = async (req, res) => {

    /*
    // Checking user
    let user = await User.findOne({ email: req.body.email, password: req.body.password }).catch(() => {
        console.log("Finding Error");
    })



    if (user) {

        // id pass to cookies
        res.cookie('user_id', user._id);
        
        // If user ther found then go to profile page
        return res.redirect('/user/profile');
    }
    else {

        // If user not found the back to same page
        console.log('User Not found')
        return res.redirect('back');
    }
    */
    req.flash('success', 'Logged in successfully');
    return res.redirect('/');
}

// Sign out 
module.exports.destroySession = function (req, res, next) {
    req.logout(function (err) {

        if (err) {
            return next(err);
        }
        req.flash('success', 'You have logged out!');
        return res.redirect('/');
    });

}

// Update user
module.exports.update = async (req, res) => {

    try {

        let userId = await req.user
        if (userId.id == req.params.id) {
            await User.findByIdAndUpdate(req.params.id, req.body)
                .then(() => res.redirect('back'));
        }
        else {
            return res.status(401).send('Unauthorized');
        }

    } catch (error) {
        console.log('Error: ', error);
    }

}