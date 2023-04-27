const express = require('express');
const router = express.Router();
const passport = require('passport');


const userController = require('../controllers/user_controller')

// Check user is preset or not then other funtion work using 'passport autontication'
router.get('/profile/:id', passport.checkAuthentication, userController.profile);
router.post('/update/:id', passport.checkAuthentication, userController.update);

// Login or sign up route
router.get('/sign-up', userController.signUp);
router.get('/sign-in', userController.signIn);

router.post('/create', userController.create);

// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    { failureRedirect: '/user/sign-in' }
), userController.createSession);

router.get('/sign-out', userController.destroySession);


router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/user/sign-in' }), userController.createSession)

module.exports = router;