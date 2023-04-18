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
module.exports.create = (req, res) => {
    // TODO later
}

// Sign in and create a session for ther user
module.exports.createSession = (req, res) => {
    // TODO later
}