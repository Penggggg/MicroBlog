var fs = require('fs');
var url = require('url');
var _ = require('underscore');
var UserModel = require('../models/user');
var MovieModel = require('../models/movie');

/*
 * GET home page.
 */
exports.index = function(req, res){
	//返回页面
	console.log('user in session: ')
	console.log(req.session.user)
	var readPath = BASE_DIR + '/views/' + url.parse('main.html').pathname;
	fs.readFile(readPath, function(err, data){
		res.end(data);
	}); 
};
/*
 * GET User
 */
exports.initUserData = function(req, res){
	// res.send('this is not implemented now');
	return UserModel.find({}, function(err, users){
		if(!err){
			return res.send(users);
		}else{
			res.statusCode = 500;
			console.log('Get Error...')
			return res.send({error: 'Server error'})
		}
	})
}

exports.findUserByName = function(req, res){
	console.log(req.params)
	return UserModel.findByName(req.params.theparam, function(err, user){
		if(!user){
			return res.send('找不到该用户')
		}else{
			return res.send({status: 'OK', user: user})
		}
	})
}

exports.addNewUser = function(req, res){
	var newUser = new UserModel({
		name: req.body['name'],
		password: req.body['password']
	})
	newUser.save(function(err){
			if(err){
				return res.send({status: 'Fail', err: err})
			}else if(err === null || err === undefined){
				console.log('Save!');
				console.log(req.body['name'])
				UserModel.findByName(req.body['name'], function(err, user){
					if(!user){
						return res.send('找不到该用户')
					}else{
						console.log('正在从服务器返回role...');
						return res.send({status: 'Save', role: user[0].role})
					}
				})
				//返回一个role代码
				
			}
	})
}

exports.updateUser = function(req, res){
	UserModel.findByName(req.body['name'], function(err, data){
		if(!data){
			res.statusCode = 404;
			return res.send({err: 'Not Found'})
		}else{
			var condition = {name: req.body['name']};
			var update = {$set: {password: req.body['password']}};
			var options = {upsert: true};
			UserModel.update(condition, update, options, function(err){
				if(err){
					console.log(err)
				}else{
					return res.send('更新成功!')
				}
			})
		}
	})
}

exports.deleteUser = function(req, res){
	UserModel.findByName(req.body['name'], function(err, data){
		if(data.length <= 0){
			res.statusCode = 404;
			return res.send({err: 'Not Found'})
		}else{
			var condition = {name: req.body['name']};
			UserModel.remove(condition, function(err){
				if(err){
					console.log(err)
				}else{
					return res.send('删除成功')
				}
			})
		}
	})
}
/*
 * GET Movie
 */
exports.initMovieData = function(req, res){
	MovieModel.fetch(function(err, result){
		if(err != null || err != undefined){
			return res.send({err: 'err'});
		}
		return res.send(JSON.stringify(result))
	})
}

exports.getMovieData = function(req, res){
	var movieName = req.params.theparam;
	MovieModel.findByName(movieName, function(err, movie){
		if(err != null || err != undefined){
			return res.send({err: 'err'});
		}
		return res.send({statusCode: 'OK', movie: movie})
	})
}

exports.updateMovie = function(req, res){
	MovieModel.findByName(req.body['title'], function(err, data){
		if(!data){
			res.statusCode = 404;
			return res.send({err: 'Not Found'})
		}else{
			var condition = {title: req.body['title']};
			var update = {$set: {
				doctor: req.body['doctor'],
				language: req.body['language'],
				country: req.body['country'],
				summary: req.body['summary'],
				flash: req.body['flash'],
				poster: req.body['poster'],
				year: req.body['year'],				
			}};
			var options = {upsert: true};
			MovieModel.update(condition, update, options, function(err){
				if(err){
					console.log(err)
				}else{
					return res.send({statusCode: '更新成功'})
				}
			})
		}
	})	
}

exports.addMovieData = function(req, res){
	var newMoview = new MovieModel({
		title: req.body['title'],
		doctor: req.body['doctor'],
		language: req.body['language'],
		country: req.body['country'],
		summary: req.body['summary'],
		flash: req.body['flash'],
		poster: req.body['poster'],
		year: req.body['year']
	})
	newMoview.save(function(err){
		if(err){
			return res.send({status: 'Fail', err: err})
		}else if(err === null || err === undefined){
				console.log('Save!');
			return res.send({status: 'Save'})
		}
	})
}

exports.deleteMovie = function(req, res){
	console.log(req.params['theparam'])
	MovieModel.findByName(req.params['theparam'], function(err, data){
		if(data.length <= 0){
			res.statusCode = 404;
			return res.send({err: 'Not Found'})
		}else{
			var condition = {title: req.params['theparam']};
			MovieModel.remove(condition, function(err){
				if(err){
					console.log(err)
				}else{
					return res.send('删除成功')
				}
			})
		}
	})
}

/*
*	Sign In
*/
exports.signIn = function(req, res){
	var username = req.body['name'];
	var password = req.body['password'];
	UserModel.findByName(username, function(err, user){
		if(user.length == 0){
			console.log('抱歉用户不存在')
			return res.send({status: 'OK', user: user})
		}
		if(password == user[0].password ){
			console.log('登录成功')
			req.session.user = user[0];
			console.log('user in session: ')
			//session...
			console.log(req.session.user)
			return res.send({status: 'OK', user: user, userState: '登录成功'})
		}else{
			console.log('密码错误!')
			return res.send({status: 'OK', user: user, userState: '密码错误'})
		}
		
	})
}

//logout
exports.logout = function(req, res){
	delete req.session.user;
	console.log('session删除成功');
	return res.send({status: '退出成功'});
}