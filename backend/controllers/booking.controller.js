'use strict';

const bookingService = require('../services/booking.service');

const bookingController = {
  quotePrice: (req, res) => {
    try {
      const { roomPrice, nights, voucher = null, today } = req.body;
      const currentToday = today || new Date().toISOString().slice(0, 10);
      const result = bookingService.priceBooking(roomPrice, nights, voucher, currentToday);
      if (result.startsWith('E')) {
        return res.status(400).json({ success: false, errorCode: result });
      }
      const [, payable, deposit] = result.split(':');
      return res.status(200).json({
        success: true,
        payable: Number(payable),
        deposit: Number(deposit),
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  checkHoldStatus: (req, res) => {
    try {
      const { booking, elapsedSec, ipn = null } = req.body;
      const status = bookingService.resolveHold(booking, elapsedSec, ipn);
      return res.status(200).json({ success: true, status });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = bookingController;
