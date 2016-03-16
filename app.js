
/**
 * Module dependencies.
 */
BASE_DIR = __dirname;
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var mongoStore = require('connect-mongo')(express);
var mongoose = require('mongoose');
var config = require('./config/config');
mongoose.connect(config.get('mongoose:uri'));

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//use cookie
//and Session
app.use(express.cookieParser());
app.use(express.session({
	secret: 'imooc',
	store: new mongoStore({
		url: config.get('mongoose:uri'),
		collection: 'sessions'
	})
}))
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname)));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
//index
app.get('/', routes.index);
//User
app.get('/api/users', routes.initUserData);
app.get('/api/users/:theparam', routes.findUserByName);
app.post('/api/users', routes.addNewUser);
app.put('/api/users/:name', routes.updateUser);
app.delete('/api/users/:name', routes.deleteUser);
//Moive
app.get('/api/movies', routes.initMovieData);
app.get('/api/movies/:theparam', routes.getMovieData);
app.put('/api/movies/:theparam', routes.updateMovie);
app.post('/api/movies', routes.addMovieData);
app.delete('/api/movies/:theparam', routes.deleteMovie);
//SignIn
app.post('/api/signIn', routes.signIn);
app.get('/api/logout', routes.logout);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
   console.log('Express server listening on port ' + config.get('port'));
});
