'use strict';

const searchService = require('../services/search.service');

const searchController = {
  searchRooms: (req, res) => {
    try {
      const { rooms = [], bookings = [] } = req.body;
      const result = searchService.summarizeSearch(rooms, req.body, bookings);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = searchController;
