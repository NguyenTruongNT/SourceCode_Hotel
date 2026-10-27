'use strict';

const { validateBookingForm } = require('../services/booking.service');

function validateBookingMiddleware(req, res, next) {
  const result = validateBookingForm(req.body);
  if (result.startsWith('E')) {
    return res.status(400).json({ success: false, errorCode: result });
  }
  req.idType = result.split(':')[1];
  next();
}

module.exports = {
  validateBookingForm,
  validateBookingMiddleware,
};
