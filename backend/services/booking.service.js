'use strict';

function validateBookingForm(form) {
  const name = (form.name || "").trim();
  if (name.length < 3 || name.length > 50 || !/^[\p{L} ]+$/u.test(name)) {
    return "E1";
  }
  if (!/^(03|05|07|08|09)\d{8}$/.test(form.phone || "")) {
    return "E2";
  }
  const email = form.email || "";
  if (email.includes(" ") || !/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(email)) {
    return "E3";
  }
  const isCccd = /^\d{12}$/.test(form.idNumber || "");
  const isPassport = /^[A-Z]\d{7}$/.test(form.idNumber || "");
  if (!isCccd && !isPassport) {
    return "E4";
  }
  if (!["VNPAY", "MOMO", "CARD"].includes(form.payment) || form.terms !== true) {
    return "E6";
  }
  if (isCccd) {
    return "OK:CCCD";
  }
  return "OK:PASSPORT";
}

function priceBooking(roomPrice, nights, v, today) {
  const total = roomPrice * nights;
  let discount = 0;
  if (v !== null) {
    if (v.status !== "Active" || today < v.start || today > v.end) {
      return "E5";
    }
    if (v.used >= v.quantity) {
      return "E5";
    }
    discount = Math.round(total * v.percent * 0.01);
  }
  const payable = total - discount;
  const deposit = Math.round(payable * 0.5);
  return "OK:" + payable + ":" + deposit;
}

function resolveHold(booking, elapsedSec, ipn) {
  if (booking.status !== "Pending") {
    return booking.status;
  }
  if (ipn !== null && ipn.code === "00" && ipn.amount >= booking.deposit) {
    return "Confirmed";
  }
  if (ipn !== null && ipn.code !== "00") {
    return "Cancelled:E6";
  }
  if (elapsedSec > 900) {
    return "Cancelled:E6";
  }
  return "Pending";
}

module.exports = {
  validateBookingForm,
  priceBooking,
  resolveHold,
};
