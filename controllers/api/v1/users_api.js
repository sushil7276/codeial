const User = require('../../../models/user');
const jwt = require('jsonwebtoken');


// Sign in and create a session for ther user
module.exports.createSession = async (req, res) => {

    try {

        let user = await User.findOne({ email: req.body.email });
        
        if (!user || user.password !== req.body.password) {
            return res.json(422, {
                message: "invalid username or password"
            });
        }

        return res.json(200, {
            message: "Sign in successful, here is your token, please keep it safe!",
            data: {
                token: jwt.sign(user.toJSON(), 'codeial', { expiresIn: '100000' })
            }
        })

    } catch (error) {
        console.log("******Error: ", error);
        return res.json(500, {
            message: "Internal Server Error"
        })
    }


}
