var app = angular.module('myApp', [
	'appController',
	'appDirective',
	'appServer',
	'ui.router',
	'ngResource',
	'ui.bootstrap', 
	'ngAnimate',
	'ngCookies'
]);

app.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/Welcome/index');
	$stateProvider
		.state('Welcome', {
			url: '/Welcome',
			views: {
				'main': {
					templateUrl: function(){return "/views/middle.html"}
				}
			}
		})
		.state('WatchMovie', {
			url: '/WatchMovie',
			views: {
				'main': {
					templateUrl: function(){return "/views/middle.html"}
				}
			}
		})	
		.state('MovieUpdate', {
			url: '/MovieUpdate',
			views: {
				'main': {
					templateUrl: function(){return "/views/middle.html"}
				}
			}
		})	
		.state('Welcome.Index', {
			url: '/index',
			views: {
				'middle': {
					templateUrl: function(){return "/views/index.html"}
				}
			}
		})
		.state('Welcome.Reg', {
			url: '/Reg',
			views: {
				'middle': {
					templateUrl: function(){return "/views/reg.html"}
				}
			}
		})
		.state('Welcome.FilmList', {
			url: '/FilmList',
			views: {
				'middle': {
					templateUrl: function(){return "/views/filmList.html"}
				}
			}
		})
		.state('Welcome.FilmManager', {
			url: '/FilmManager',
			views: {
				'middle': {
					templateUrl: function(){return "/views/filmManager.html"}
				}
			}
		})
		.state('WatchMovie.Movie', {
			url: '/:movieTitle',
			views: {
				'middle': {
					templateUrl: function(){return "/views/watchMovie.html"}
				}
			}
		})

})

app.run(function($rootScope,filmStorage,Auth){
	//全局对象
	$rootScope.rootCtrlScope = {};
	$rootScope.rootCtrlScope.username = null;
	//--------初始化-----------
	//清空film localStorage
	filmStorage.clearFilmStorage();
	//登录状态
	if(Auth.isLoggedIn()){
		$rootScope.rootCtrlScope.username = Auth.getUser();
		console.log('已登录.当前用户: '+ $rootScope.rootCtrlScope.username)
	}else{
		console.log('未登录')
		$rootScope.rootCtrlScope.username = null;
	}

})



