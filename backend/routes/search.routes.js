'use strict';

const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');
const { validateSearchMiddleware } = require('../validators/search.validator');

router.post('/rooms', validateSearchMiddleware, searchController.searchRooms);

module.exports = router;
