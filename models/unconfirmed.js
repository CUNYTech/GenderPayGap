var mongoose = require('mongoose');

var schema = {
    sendDate: {
        type: Date,
        default: Date.now
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    userEmail: 'String',
};

var unconfirmedSchema = mongoose.Schema(schema);

var Unconfirmed = mongoose.model('unconfirmedemail', unconfirmedSchema);
module.exports = Unconfirmed;