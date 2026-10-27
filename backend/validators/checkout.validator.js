'use strict';

const { validateCheckout } = require('../services/checkout.service');

function validateCheckoutMiddleware(req, res, next) {
  const { room, minibar, damageFee } = req.body;
  const result = validateCheckout(room, minibar, damageFee);
  if (result.startsWith('E')) {
    return res.status(400).json({ success: false, errorCode: result });
  }
  req.minibarItems = Number(result.split(':')[1]);
  next();
}

module.exports = {
  validateCheckout,
  validateCheckoutMiddleware,
};
