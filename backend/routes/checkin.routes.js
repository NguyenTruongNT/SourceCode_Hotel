'use strict';

const express = require('express');
const router = express.Router();
const checkinController = require('../controllers/checkin.controller');
const { verifyCheckinMiddleware, assignDepositMiddleware } = require('../validators/checkin.validator');

router.post('/verify', verifyCheckinMiddleware, (req, res) => {
  res.status(200).json({ success: true, authStatus: req.authStatus });
});
router.post('/assign-deposit', assignDepositMiddleware, (req, res) => {
  res.status(200).json({ success: true, message: 'Room assigned and deposit accepted' });
});
router.post('/process', checkinController.checkinGuest);

module.exports = router;
