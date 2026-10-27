'use strict';

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { validateBookingMiddleware } = require('../validators/booking.validator');

router.post('/validate', validateBookingMiddleware, (req, res) => {
  res.status(200).json({ success: true, idType: req.idType });
});
router.post('/quote', bookingController.quotePrice);
router.post('/hold-status', bookingController.checkHoldStatus);

module.exports = router;
