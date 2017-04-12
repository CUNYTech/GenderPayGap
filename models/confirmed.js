var mongoose = require('mongoose');
var params = require('../lib/gpgParams.js');

var schema = {
    confirmDate: {
        type: Date,
        default: Date.now
    },
    surveyDate: Date
};
for (i = 0; i < params.getAllFieldsLen(); i++) {              // Fixed getter method
    schema[params.getAllFieldsMap(i)] = params.getAllFieldsType(i);
}
//console.log(schema);
var confirmedSchema = mongoose.Schema(schema);
var Confirmed = mongoose.model('confirmedemail', confirmedSchema);

module.exports.getUserByEmail = function(email, callback) {
  var query = {email: email};
}

module.exports = Confirmed;
