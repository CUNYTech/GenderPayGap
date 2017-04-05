// This is a test schema. 
var mongoose = require('mongoose'),
    bcrypt = require('bcryptjs');

// Schema for now.
var unconfirmedSchema = mongoose.Schema({
  email: {
    type: String
  },
  password: {
    type: String
  }
});

var User = module.exports = mongoose.model('User', unconfirmedSchema);

// Encrypt inserted password with bcrypt.
module.exports.createUser = function(newUser, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}
