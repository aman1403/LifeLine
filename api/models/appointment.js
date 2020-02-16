const mongoose = require('mongoose');

const appointmentSchems = mongoose.Schema({
    senderUserEmailId : String,
    senderUserName : String,
    senderUserBloodGroup : String,
    hospitalName: String,
    hospitalEmailId: String,
    hospitalStreetAddress: String,
    hospitalCity: String,
    hospitalZipCode: String,
    hospitalState: String,
    hospitalContactNumber: String,
    appointmentStatus : String,
    appointmentDate : String,
    appointmentTime : String,
    bloodquantity: Number
});

module.exports = mongoose.model('Appointment', appointmentSchems);