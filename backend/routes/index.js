'use strict';

const express = require('express');
const router = express.Router();

const searchRoutes = require('./search.routes');
const bookingRoutes = require('./booking.routes');
const checkinRoutes = require('./checkin.routes');
const checkoutRoutes = require('./checkout.routes');
const roomRoutes = require('./room.routes');
const voucherRoutes = require('./voucher.routes');

router.use('/search', searchRoutes);
router.use('/bookings', bookingRoutes);
router.use('/checkin', checkinRoutes);
router.use('/checkout', checkoutRoutes);
router.use('/rooms', roomRoutes);
router.use('/vouchers', voucherRoutes);

module.exports = router;
