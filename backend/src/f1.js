'use strict';

function validateSearchRequest(req, today) {
  const dateRe = /^\d{4}-\d{2}-\d{2}$/;
  if (!req.checkIn || !dateRe.test(req.checkIn)) {
    return "E1";
  }
  if (req.checkIn < today) {
    return "E1";
  }
  if (!req.checkOut || !dateRe.test(req.checkOut) || req.checkOut <= req.checkIn) {
    return "E2";
  }
  const nights = (Date.parse(req.checkOut) - Date.parse(req.checkIn)) / 86400000;
  const guests = Number(req.guests);
  if (!Number.isInteger(guests) || guests < 1 || guests > 10) {
    return "E3";
  }
  return "OK:" + nights;
}

function isRoomAvailable(room, req, bookings) {
  if (room.status !== "Active" || room.capacity < req.guests) {
    return false;
  }
  if (req.type !== "ALL" && room.type !== req.type) {
    return false;
  }
  for (const b of bookings) {
    if (b.room === room.code) {
      if (b.status === "Confirmed" || b.status === "In-house") {
        if (req.checkIn < b.checkOut && b.checkIn < req.checkOut) {
          return false;
        }
      }
    }
  }
  return true;
}

function summarizeSearch(rooms, req, bookings) {
  let available = 0;
  let cheapest = null;
  for (const room of rooms) {
    if (isRoomAvailable(room, req, bookings)) {
      available += 1;
      if (cheapest === null || room.price < cheapest) {
        cheapest = room.price;
      }
    }
  }
  if (available === 0) {
    return "NO_ROOM";
  }
  return "FOUND:" + available + ":" + cheapest;
}

module.exports = {
  validateSearchRequest,
  isRoomAvailable,
  summarizeSearch,
};
