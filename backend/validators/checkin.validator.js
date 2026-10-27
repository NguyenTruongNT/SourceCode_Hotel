'use strict';

const { verifyCheckin, validateAssignAndDeposit } = require('../services/checkin.service');

function verifyCheckinMiddleware(req, res, next) {
  const { pnr, cccd, booking, authorized } = req.body;
  const result = verifyCheckin(pnr, cccd, booking, authorized);
  if (result.startsWith('E')) {
    return res.status(400).json({ success: false, errorCode: result });
  }
  req.authStatus = result;
  next();
}

function assignDepositMiddleware(req, res, next) {
  const { room, booking, deposit, keycard } = req.body;
  const result = validateAssignAndDeposit(room, booking, deposit, keycard);
  if (result !== 'OK') {
    return res.status(400).json({ success: false, errorCode: result });
  }
  next();
}

module.exports = {
  verifyCheckin,
  validateAssignAndDeposit,
  verifyCheckinMiddleware,
  assignDepositMiddleware,
};
