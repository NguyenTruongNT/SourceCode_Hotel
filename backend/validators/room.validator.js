'use strict';

const { validateRoomCode, validateRoomSpec, validatePhoto } = require('../services/room.service');

function validateRoomMiddleware(req, res, next) {
  const { code, floor, existing, spec, photo } = req.body;
  if (code !== undefined) {
    const codeRes = validateRoomCode(code, floor, existing || []);
    if (codeRes !== 'OK') {
      return res.status(400).json({ success: false, errorCode: codeRes, field: 'code' });
    }
  }
  if (spec !== undefined) {
    const specRes = validateRoomSpec(spec);
    if (specRes !== 'OK') {
      return res.status(400).json({ success: false, errorCode: specRes, field: 'spec' });
    }
  }
  if (photo !== undefined) {
    const photoRes = validatePhoto(photo);
    if (photoRes !== 'OK') {
      return res.status(400).json({ success: false, errorCode: photoRes, field: 'photo' });
    }
  }
  next();
}

module.exports = {
  validateRoomCode,
  validateRoomSpec,
  validatePhoto,
  validateRoomMiddleware,
};
