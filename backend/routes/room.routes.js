'use strict';

const express = require('express');
const router = express.Router();
const roomController = require('../controllers/room.controller');
const { validateRoomMiddleware } = require('../validators/room.validator');

router.post('/', validateRoomMiddleware, roomController.createRoom);

module.exports = router;
