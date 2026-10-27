'use strict';

const roomController = {
  createRoom: (req, res) => {
    try {
      const { code, spec } = req.body;
      return res.status(201).json({
        success: true,
        message: 'Room registered successfully',
        room: { code, ...spec },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = roomController;
