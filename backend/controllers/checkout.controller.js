'use strict';

const checkoutService = require('../services/checkout.service');

const checkoutController = {
  calculateBill: (req, res) => {
    try {
      const { time, nightPrice, bill } = req.body;
      const lateFee = time ? checkoutService.calcLateFee(time, nightPrice || 0) : 0;
      const settlement = checkoutService.settleBill({
        ...bill,
        lateFee: (bill.lateFee || 0) + lateFee,
      });
      return res.status(200).json({
        success: true,
        lateFee,
        settlement,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = checkoutController;
