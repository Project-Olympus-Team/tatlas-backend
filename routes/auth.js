const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Kullanıcı kayıt işlemi için route
router.post('/register', authController.register);
// Kullanıcı giriş işlemi için route
router.post('/login', authController.login);

module.exports = router;