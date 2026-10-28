'use strict';

function verifyCheckin(pnr, cccd, booking, authorized) {
  if (!/^HST\d{5}$/.test(pnr || "")) {
    return "E1";
  }
  if (!booking || booking.status !== "Confirmed") {
    return "E1";
  }
  if (!/^\d{12}$/.test(cccd || "")) {
    return "E2";
  }
  if (cccd !== booking.cccd) {
    if (authorized === true) {
      return "OK:AUTH";
    }
    return "E2";
  }
  return "OK";
}

function validateAssignAndDeposit(room, booking, deposit, keycard) {
  if (!room || room.type !== booking.roomType || room.status !== "Clean") {
    return "E3";
  }
  const amount = Number(deposit);
  if (deposit === "" || deposit === null || isNaN(amount) || amount < 500000) {
    return "E4";
  }
  if (!/^[0-9A-Fa-f]{6,10}$/.test(keycard || "")) {
    return "BLOCK";
  }
  return "OK";
}

function earlyCheckinFee(time, nightPrice, hasCleanRoom) {
  const minutes = Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));
  if (minutes >= 840) {
    return 0;
  }
  let rate = 0;
  if (minutes >= 360 && minutes < 540) {
    rate = 0.5;
  } else {
    if (minutes >= 540 && hasCleanRoom) {
      rate = 0.3;
    }
  }
  if (rate === 0) {
    return -1;
  }
  return Math.round(nightPrice * rate);
}

module.exports = {
  verifyCheckin,
  validateAssignAndDeposit,
  earlyCheckinFee,
};
