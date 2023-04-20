const express = require('express');
const router = express.Router();
const passport = require('passport');


const userController = require('../controllers/user_controller')

router.get('/profile',passport.checkAuthentication, userController.profile);

router.get('/sign-up', userController.signUp);
router.get('/sign-in', userController.signIn);

router.post('/create', userController.create);
// router.post('/create-session', userController.createSession);

// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    { failureRedirect: '/user/sign-in' }
), userController.createSession);

module.exports = router;