var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');
var UserModel = mongoose.model('usermessage', UserSchema);

module.exports = UserModel;
