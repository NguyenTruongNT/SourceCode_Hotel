'use strict';

const voucherService = require('../services/voucher.service');

const voucherController = {
  applyVoucher: (req, res) => {
    try {
      const { codes = [], store = {}, today } = req.body;
      const currentToday = today || new Date().toISOString().slice(0, 10);
      const result = voucherService.redeemVoucher(codes, store, currentToday);
      if (result.startsWith('E') || result === 'REJECT_MULTI') {
        return res.status(400).json({ success: false, errorCode: result });
      }
      return res.status(200).json({ success: true, result });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = voucherController;
