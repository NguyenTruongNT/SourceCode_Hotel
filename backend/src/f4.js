'use strict';

function validateCheckout(room, minibar, damageFee) {
  if (!room || room.status !== "Occupied") {
    return "E1";
  }
  let items = 0;
  for (const qty of minibar) {
    if (!Number.isInteger(qty) || qty < 0 || qty > 50) {
      return "E2";
    }
    items += qty;
  }
  const fee = Number(damageFee);
  if (damageFee !== "" && damageFee !== null) {
    if (isNaN(fee) || fee < 0) {
      return "E3";
    }
  }
  return "OK:" + items;
}

function calcLateFee(time, nightPrice) {
  const minutes = Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));
  let rate = 0;
  if (minutes > 1080) {
    rate = 1;
  } else {
    if (minutes > 900) {
      rate = 0.5;
    } else {
      if (minutes > 720) {
        rate = 0.3;
      }
    }
  }
  return Math.round(nightPrice * rate);
}

function settleBill(bill) {
  const extra = bill.remain + bill.lateFee + bill.minibar + bill.damage;
  const balance = extra - bill.deposit;
  if (balance > 0) {
    if (bill.paid !== true) {
      return "E3";
    }
    return "COLLECT:" + balance;
  } else {
    if (balance < 0) {
      return "REFUND:" + (-balance);
    }
  }
  return "EVEN";
}

module.exports = {
  validateCheckout,
  calcLateFee,
  settleBill,
};
