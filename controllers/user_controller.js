const User = require("../models/user");


module.exports.profile = (req, res) => {
    return res.render('user', {
        title: "User Profile"
    })
}

// Render the sign up page
module.exports.signUp = (req, res) => {
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}

// Render the sign In page
module.exports.signIn = (req, res) => {
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

// Get the sign up data
module.exports.create = async (req, res) => {

    // checking password
    if (req.body.password != req.body.c_password) {
        console.log('Please enter correct password')
        return res.redirect('back');
    }

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })

    // Check Email is already present or not
    let user1 = await User.findOne({ email: user.email }).catch(()=> console.log("Error in finding user in signing up"))


    // If user in not present then Create new user
    if (!user1) {

        await user.save().then(() => res.redirect('/user/sign-in'))
            .catch(() => console.log('Error in creating user while signing up'))

    }
    else {
        console.log('User alredy Existed')
        return res.redirect('back');
    }
}

// Sign in and create a session for ther user
module.exports.createSession = (req, res) => {
    // TODO later
}