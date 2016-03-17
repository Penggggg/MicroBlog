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

app.constant('ACCESS_LEVELS', {
	tourist: 0,
	user: 1,
	admin: 10
})

app.config(function($stateProvider, $urlRouterProvider, ACCESS_LEVELS, $locationProvider){
	$locationProvider.html5Mode(false);
	$urlRouterProvider.otherwise('/Welcome/index');
	$stateProvider
		.state('Welcome', {
			url: '/Welcome',
			views: {
				'main': {
					templateUrl: function(){return "/views/middle.html"},
					access_level: ACCESS_LEVELS.tourist
				}
			}
		})
		.state('WatchMovie', {
			url: '/WatchMovie',
			views: {
				'main': {
					templateUrl: function(){return "/views/middle.html"},
					access_level: ACCESS_LEVELS.tourist
				}
			}
		})	
		.state('MovieUpdate', {
			url: '/MovieUpdate',
			views: {
				'main': {
					templateUrl: function(){return "/views/middle.html"},
					access_level: ACCESS_LEVELS.tourist
				}
			}
		})	
		.state('Welcome.Index', {
			url: '/index',
			views: {
				'middle': {
					templateUrl: function(){return "/views/index.html"},
					access_level: ACCESS_LEVELS.tourist
				}
			}
		})
		.state('Welcome.Reg', {
			url: '/Reg',
			views: {
				'middle': {
					templateUrl: function(){return "/views/reg.html"},
					access_level: ACCESS_LEVELS.tourist
				}
			}
		})
		.state('Welcome.FilmList', {
			url: '/FilmList',
			views: {
				'middle': {
					templateUrl: function(){return "/views/filmList.html"},
					access_level: ACCESS_LEVELS.tourist
				}
			}
		})
		.state('Welcome.FilmManager', {
			url: '/FilmManager',
			views: {
				'middle': {
					templateUrl: function(){return "/views/filmManager.html"},
					access_level: ACCESS_LEVELS.user
				}
			}
		})
		.state('WatchMovie.Movie', {
			url: '/:movieTitle',
			views: {
				'middle': {
					templateUrl: function(){return "/views/watchMovie.html"},
					access_level: ACCESS_LEVELS.tourist
				}
			}
		})

})

app.run(function($rootScope,filmStorage,Auth,$location){
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
	//-------路由监听--------
	$rootScope.$on('$stateChangeStart', function(eve, next, curr){
		var nextAuth = next.views.middle.access_level;
		if(Auth.isLoggedIn()){
			console.log('当前用户等级：' + Auth.getUserRole() + "当前路由等级：" + nextAuth)
		}else{
			console.log('当前用户等级：' + '还没有登录' + "当前路由等级：" + nextAuth)
		}
			if(!Auth.isAuthorized(nextAuth)){
				//没有访问权限
				console.log('没有访问权限')
				if(Auth.isLoggedIn()){
					$location.path('/');
				}else{
					//如果没有登录
					$location.path('/')
				}
			}
		
		
	
	})

})



