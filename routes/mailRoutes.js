const express = require('express');
const mailControllers = require('../controllers/mailControllers');
const bodyParser = require('body-parser');

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/send-mail/', mailControllers.mailer);

module.exports = router;