const { Router } = require('express');
const authController = require('../controllers/authController');


const router = Router();

// router.get('/signup-get', authController.signupGet);

router.post('/signup', authController.signupPost);

// router.get('/login', authController.loginGet);

router.post('/login', authController.loginPost);

router.get('/logout', authController.logoutGet);

router.post('/change-password', authController.changePasswordPut)

module.exports = router;
