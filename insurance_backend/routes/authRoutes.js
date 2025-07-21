const express = require('express');
const router = express.Router();

// Controllers
//const signup = require('../controllers/signupController');
//const login = require('../controllers/loginController');
//const sendOtpEmail = require('../controllers/sendOtpEmail');
//const verifyOtpEmail = require('../controllers/verifyOtpEmail');
//const sendOtpSMS = require('../controllers/sendOtpSMS');
//const verifyOtpSMS = require('../controllers/verifyOtpSMS');
//const passport = require('passport');
const signupController = require('../controllers/signupController');
const loginController = require('../controllers/loginController');

// Routes
router.post('/signup', signupController);
router.post('/login', loginController);
/*
router.post('/send-otp-email', sendOtpEmail);
router.post('/verify-otp-email', verifyOtpEmail);

router.post('/send-otp-sms', sendOtpSMS);
router.post('/verify-otp-sms', verifyOtpSMS);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // redirect with token
    const jwt = require('../utils/jwt');
    const token = jwt.generateToken(req.user);
    res.redirect(`http://localhost:3000/oauth-success?token=${token}`);
  });
*/
module.exports = router;
