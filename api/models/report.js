const mongoose = require('mongoose');

const reportSchems = mongoose.Schema({
  Haemoglobin: String,
  PackedCell: String,
  LeucocyteCount: String,
  RBCCount: String,
  MCV: String,
  MCH: String,
  MCHC: String,
  PlateletCount: String,
  MPV: String,
  RDW: String
});

module.exports = mongoose.model('Report', reportSchems);