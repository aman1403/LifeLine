const mongoose = require('mongoose');

const connectionSchems = mongoose.Schema({
    senderUserEmailId : String,
    senderUserName : String,
    senderUserBloodGroup : String,
    receiverUserEmailId : String,
    receiverUserName : String,
    receiverUserBloodGroup : String,
    status : String
});

module.exports = mongoose.model('Connection', connectionSchems);