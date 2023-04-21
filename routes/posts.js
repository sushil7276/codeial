const express = require('express');
const router = express.Router();
const passport = require('passport');
const postController = require('../controllers/post_controller');

// check user is signIn (using passport authentication)
router.post('/create-post',passport.checkAuthentication, postController.createComment);


module.exports = router;