'use strict';

const { validateSearchRequest } = require('../services/search.service');

function validateSearchMiddleware(req, res, next) {
  const today = req.body.today || new Date().toISOString().slice(0, 10);
  const result = validateSearchRequest(req.body, today);
  if (result.startsWith('E')) {
    return res.status(400).json({ success: false, errorCode: result });
  }
  req.searchNights = result.split(':')[1];
  next();
}

module.exports = {
  validateSearchRequest,
  validateSearchMiddleware,
};
