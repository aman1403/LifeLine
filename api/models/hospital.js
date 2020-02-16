const mongoose = require('mongoose');
const hospitalSchems = mongoose.Schema({
    hospitalName: String,
    hospitalRegistrationNumber: String,
    hospitalEmailId: String,
    hospitalStreetAddress: String,
    hospitalCity: String,
    hospitalZipCode: String,
    hospitalState: String,
    hospitalContactNumber: String,
    hospitalPassword: String,
    bloodtypes:[{type:String}],
    icus:{type:Number},
    attr:[{type:String}],
    appointments:[{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    longitude:{type:Number},
    latitude:{type:Number},
    money:{type:Number,default:5000}
});

module.exports = mongoose.model('Hospital', hospitalSchems);