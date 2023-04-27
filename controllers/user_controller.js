const User = require("../models/user");
const fs = require('fs');
const path = require('path');


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
            return res.redirect('/users/profile');
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
        return res.redirect('/users/profile');
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

            await user.save().then(() => res.redirect('/users/sign-in'))
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



    let userId = await req.user
    if (userId.id == req.params.id) {

        try {

            let user = await User.findById(req.params.id);

            User.uploadedAvatar(req, res, async (err) => {
                if (err) { console.log('**** Multer Error: ', err) }

                user.name = req.body.name;
                user.email = req.body.email;

                if (req.file) {

                    // if any file is not there then this code show error
                    if (user.avatar) {

                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }


                    // This is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }

                await user.save();
                return res.redirect('back');
            })


            // await User.findByIdAndUpdate(req.params.id, req.body)
            //     .then(() => res.redirect('back'));
        }
        catch (error) {
            req.flash('error', error);
            return res.redirect('back');
        }

    }
    else {
        req.flash('error', 'Unauthorized');
        return res.status(401).send('Unauthorized');
    }


}