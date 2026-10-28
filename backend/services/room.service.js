'use strict';

function validateRoomCode(code, floor, existing) {
  if (!code || code.length < 3 || code.length > 6) {
    return "E1";
  }
  if (!/^P\d+$/.test(code)) {
    return "E1";
  }
  if (existing.includes(code)) {
    return "E1";
  }
  const prefix = Number(code.slice(1, code.length - 2));
  if (prefix !== floor) {
    return "E1";
  }
  return "OK";
}

function validateRoomSpec(spec) {
  const floor = Number(spec.floor);
  if (spec.floor === "" || !Number.isInteger(floor) || floor < 1 || floor > 15) {
    return "E2";
  }
  const price = Number(spec.price);
  if (spec.price === "" || isNaN(price) || price < 200000 || price > 50000000) {
    return "E3";
  }
  const capacity = Number(spec.capacity);
  if (spec.capacity === "" || !Number.isInteger(capacity) || capacity < 1 || capacity > 8) {
    return "E4";
  }
  return "OK";
}

function validatePhoto(file) {
  if (!file) {
    return "NOFILE";
  }
  if (!file.name.includes(".")) {
    return "E5";
  }
  const ext = file.name.split(".").pop().toLowerCase();
  if (!["jpg", "jpeg", "png"].includes(ext)) {
    return "E5";
  }
  if (isNaN(file.sizeMB) || file.sizeMB > 5) {
    return "E5";
  }
  return "OK";
}

module.exports = {
  validateRoomCode,
  validateRoomSpec,
  validatePhoto,
};
