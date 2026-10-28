'use strict';

function validateVoucherForm(form, activeCodes, today) {
  const title = (form.title || "").trim();
  if (title.length < 5 || title.length > 100 || /[<>]/.test(title) || /script/i.test(title)) {
    return "E1";
  }
  if (!/^[A-Z0-9]{4,15}$/.test(form.code || "") || activeCodes.includes(form.code)) {
    return "E2";
  }
  const percent = Number(form.percent);
  if (form.percent === "" || isNaN(percent) || percent < 1 || percent > 70) {
    return "E3";
  }
  if (!form.start || form.start < today) {
    return "E4";
  }
  if (!form.end || form.end < form.start) {
    return "E5";
  }
  const quantity = Number(form.quantity);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10000) {
    return "E6";
  }
  return "OK";
}

function voucherStatus(v, today) {
  const remaining = v.quantity - v.used;
  if (v.suspended === true) {
    return "Suspended";
  }
  if (remaining <= 0) {
    return "Depleted";
  }
  if (today > v.end) {
    return "Expired";
  }
  if (today < v.start) {
    return "Scheduled";
  }
  return "Active";
}

function redeemVoucher(codes, store, today) {
  if (codes.length > 1) {
    return "REJECT_MULTI";
  }
  let applied = null;
  for (const c of codes) {
    const v = store[c];
    if (v === undefined || voucherStatus(v, today) !== "Active") {
      return "E5";
    }
    applied = c;
  }
  if (applied === null) {
    return "NONE";
  }
  return "APPLIED:" + applied;
}

module.exports = {
  validateVoucherForm,
  voucherStatus,
  redeemVoucher,
};
