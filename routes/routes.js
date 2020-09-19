const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/isUserLoggedIn', authController.loggedIn);

module.exports = router;