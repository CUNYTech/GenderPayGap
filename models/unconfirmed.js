var mongoose = require('mongoose');
    //bcrypt = require('bcryptjs');

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
    password: 'String'
};

var unconfirmedSchema = mongoose.Schema(schema);

var Unconfirmed = module.exports = mongoose.model('unconfirmedemail', unconfirmedSchema);

// Encrypt inserted password with bcrypt. When making call to Unconfirmed.createUser()
// an issue occurs where the response cannot set headers and instead of getting redirected
// we are just redirected to '/'. The record does make its way to the database though.
/*
module.exports.createUser = function(newUser, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}
*/
