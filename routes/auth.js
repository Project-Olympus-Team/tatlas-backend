const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');

// Kullanıcı kayıt işlemi için route
router.post('/register', authController.register);
// Kullanıcı giriş işlemi için route
router.post('/login', authController.login);
// google giriş aaaaaaaaaaaaahhhhhhhhhelpppp
router.get('/google', passport.authenticate('google', { scope: ['profile', email] }));

router.get('/google/callback', 
    passport.authenticate('google', { session: false }),
    (req, res) => {
      const token = generateToken(req.user);
      res.json({ token });
    }
);
  
module.exports = router;