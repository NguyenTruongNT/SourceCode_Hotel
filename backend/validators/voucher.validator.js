'use strict';

const { validateVoucherForm } = require('../services/voucher.service');

function validateVoucherMiddleware(req, res, next) {
  const { form, activeCodes, today } = req.body;
  const currentToday = today || new Date().toISOString().slice(0, 10);
  const result = validateVoucherForm(form, activeCodes || [], currentToday);
  if (result !== 'OK') {
    return res.status(400).json({ success: false, errorCode: result });
  }
  next();
}

module.exports = {
  validateVoucherForm,
  validateVoucherMiddleware,
};
