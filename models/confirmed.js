var mongoose = require('mongoose');
var params = require('../lib/gpgParams.js');
var bcrypt = require('bcryptjs');

var schema = {
    confirmDate: {
        type: Date,
        default: Date.now
    },
    surveyDate: Date,
    password: 'String'
};
for (i = 0; i < params.allFieldsMap.length; i++) { // not sure why getter methods not working - gpgParams.js
    schema[params.allFieldsMap[i]] = params.allFieldsType[i];
}
//console.log(schema);
var confirmedSchema = mongoose.Schema(schema);
var Confirmed = mongoose.model('confirmedemail', confirmedSchema);

module.exports.getUserByEmail = function(email, callback) {
    var query = {
        email: email
    };
    Confirmed.findOne(query, callback);
}

module.exports.getUserById = function(id, callback) {
    Confirmed.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}

module.exports = Confirmed;
