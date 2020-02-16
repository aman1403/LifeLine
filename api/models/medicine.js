const mongoose = require('mongoose');
const medicineSchems = mongoose.Schema({
    dispencaryName: String,
    long:{type:Number},
    lat:{type:Number},
    medicines: [{type:String}]
});
module.exports = mongoose.model('Dispencary', medicineSchems);