var mongoose = require('mongoose');
var params = require('../lib/gpgParams.js');

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

var confirmedSchema = mongoose.Schema(schema);

var Unconfirmed = mongoose.model('confirmedemail', confirmedSchema);
module.exports = Confirmed;