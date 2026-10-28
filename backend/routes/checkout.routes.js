'use strict';

const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkout.controller');
const { validateCheckoutMiddleware } = require('../validators/checkout.validator');

router.post('/validate', validateCheckoutMiddleware, (req, res) => {
  res.status(200).json({ success: true, minibarItems: req.minibarItems });
});
router.post('/settle', checkoutController.calculateBill);

module.exports = router;
