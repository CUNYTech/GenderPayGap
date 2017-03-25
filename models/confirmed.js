var mongoose = require('mongoose');
var params = require('../lib/gpgParams.js');

var schema = {   
    confirmDate: {
        type: Date,
        default: Date.now
    },
    surveyDate: Date
};
for (i = 0; i < params.allFieldsMap.length; i++) {              // not sure why getter methods not working - gpgParams.js
    schema[params.allFieldsMap[i]] = params.allFieldsType[i];
}
//console.log(schema);
var confirmedSchema = mongoose.Schema(schema);
var Confirmed = mongoose.model('confirmedemail', confirmedSchema);

module.exports = Confirmed;

