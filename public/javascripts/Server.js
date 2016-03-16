var appServer = angular.module('appServer', []);

appServer.factory('filmStorage', ['$window', function($window){
	var isSupportLocalStorage = function (){
		if($window.localStorage == 'undefined'){
			return "false";
		}else{
			return "true"
		}
	}
	var hasFilmStorage = function(){
		if($window.localStorage["film"]){
			return "true"
		}else{
			return "false"
		}
	}
	var setFilmStorage = function(data){
		$window.localStorage["film"] = JSON.stringify(data);
		console.log('保存到本地');
	}
	var getFilmStorage = function(){
		console.log('从本地取出')
		return JSON.parse($window.localStorage["film"]);

	}
	var clearFilmStorage = function(data){
		console.log('清空本地')
		return $window.localStorage.removeItem('film');
	}
	var getFilmByName = function(movieName, deferred){
		console.log('Searching ' + movieName);
		var movieData = JSON.parse($window.localStorage["film"]);
		for(var i = 0; i < movieData.length; i++){
			(function(){
				var index = i;
				if(movieData[index].title == movieName){
					deferred.resolve(movieData[index])
					return movieData[index]
				}
			}())
		}
	}
	return {
		isSupportLocalStorage: function(){
			return isSupportLocalStorage();
		},
		hasFilmStorage: function(){
			return hasFilmStorage();
		},
		setFilmStorage: function(data){
			return setFilmStorage(data)
		},
		getFilmStorage: function(){
			return getFilmStorage();
		},
		clearFilmStorage: function(){
			return clearFilmStorage();
		},
		getFilmByName: function(movieName,deferred){
			return getFilmByName(movieName,deferred)
		}
	}
}])

appServer.factory('eventEmmiter', ['$rootScope','$timeout', function($rootScope, $timeout){
	var toBroadcast = function(eventType, args){
		$timeout(function(){
			console.log('$rootScope发射事件中...')		
			$rootScope.$broadcast(eventType, args);
		}, 10)
	}
	return {
		toBroadcast: function(eventType, args){
			return toBroadcast(eventType, args)
		}
	}
}])

appServer.factory('Auth', ['$window', function($window){
	var _user;
	var setUser = function(user, deferred){
		_user = user;
		var Days = 1;
		var exp = new Date();
		exp.setTime(exp.getTime() + Days*0.5*60*60*1000);//半小时
		document.cookie = "name=" + user.name + ";expires=" + exp.toGMTString();
		deferred.resolve('cookies登录成功！')
	}
	var getUser = function(){
		var name = document.cookie.split('=')[1];
		return name
	}
	var logOut = function(){
		var name = getUser().split('=')[1];
		var date=new Date(); 
    	date.setTime(date.getTime()-10000); 
    	document.cookie="name=" + name + ";expires="+ date.toGMTString();
    	console.log('Cookies退出成功')
	}
	return {
		setUser: function(user, deferred){
			return setUser(user, deferred);
		},
		getUser: function(){
			return getUser();
		},
		logOut: function(){
			return logOut();
		},
		isLoggedIn: function(){
			return getUser() ? true : false
		}
	}
}])

