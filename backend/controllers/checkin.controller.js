'use strict';

const checkinService = require('../services/checkin.service');

const checkinController = {
  checkinGuest: (req, res) => {
    try {
      const { time, nightPrice, hasCleanRoom } = req.body;
      const earlyFee = checkinService.earlyCheckinFee(time, nightPrice, hasCleanRoom);
      return res.status(200).json({
        success: true,
        message: 'Check-in verified successfully',
        earlyFee,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = checkinController;
