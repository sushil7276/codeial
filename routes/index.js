const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');

console.log('Router Loaded');

router.get('/', homeController.home);
router.use('/user', require("./users"));
router.use('/comment', require('./posts'));




module.exports = router;