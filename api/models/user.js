const mongoose = require('mongoose');

const userSchems = mongoose.Schema({
    name: String,
    emailId: String,
    streetAddress: String,
    city: String,
    zipCode: String,
    state: String,
    gender: String,
    dateofBirth: Date,
    bloodGroup: String,
    contactNumber: String,
    password: String,
    wallet:{type:Number,default:60000},
    reprts:[{type: mongoose.Schema.Types.ObjectId, ref: "Report"}]
});

module.exports = mongoose.model('User', userSchems);