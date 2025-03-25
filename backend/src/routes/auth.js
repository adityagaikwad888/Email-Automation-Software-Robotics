const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../utils/validators');

const router = express.Router();

router.post('/register', validateRegistration, registerUser);
router.post('/login', validateLogin, loginUser);

module.exports = router;