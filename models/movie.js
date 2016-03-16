var mongoose = require('mongoose');
var MovieSchma = require('../schemas/movie');
var Movie = mongoose.model('moviemessages', MovieSchma);

module.exports = Movie;
