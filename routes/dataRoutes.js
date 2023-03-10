const express = require('express');
const dataControllers = require('../controllers/dataControllers');
const router = express.Router();

router.get('/top-sights/', dataControllers.getTopSights);
router.get('/hotels/', dataControllers.getHotels);
router.get('/desc/', dataControllers.getDesc);

module.exports = router;