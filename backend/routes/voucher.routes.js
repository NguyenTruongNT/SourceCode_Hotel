'use strict';

const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/voucher.controller');
const { validateVoucherMiddleware } = require('../validators/voucher.validator');

router.post('/validate', validateVoucherMiddleware, (req, res) => {
  res.status(200).json({ success: true, message: 'Voucher form is valid' });
});
router.post('/redeem', voucherController.applyVoucher);

module.exports = router;
