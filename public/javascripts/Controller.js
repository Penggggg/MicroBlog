var appController = angular.module('appController', []);

appController.controller('RegCtrl', ['$scope', '$resource', '$uibModal',function($scope, $resource,$uibModal){
	$scope.reg = {};
	$scope.reg.nameIsValid = true;
	$scope.reg.showTips = false;
	$scope.postRegData = function(){
		var User = $resource('/api/users');
		User.save({}, {
			name: $scope.reg.username,
			password: $scope.reg.password
		}, function(data){
			console.log(data);
			$scope.open();
		}, function(err){
			console.log(err)
		})		
	}
	$scope.open = function (data) {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: '../../views/logInSuccess.html',
			controller: 'ModalReg',
			size: 'sm',
			resolve: {
			}
		});
		modalInstance.result.then(function (data2) {
			console.log(data2);
		}, function () {
			console.log('打开失败')
		});
	};

}])

appController.controller('indexInitCtrl', ['$scope', '$resource', 'filmStorage', 'eventEmmiter','$location','$uibModal',function($scope,$resource,filmStorage,eventEmmiter,$location,$uibModal){
	$scope.Init = {};
	$scope.Init.moviesData = [];
	$scope.Init.initData = function(){
		if(filmStorage.isSupportLocalStorage){//支持storage
			var hasFilm = filmStorage.hasFilmStorage();
			//如果没有storage['film']
			console.log("has localStorage['film']: " + hasFilm)
			if( hasFilm==false || hasFilm=='false' ){
				//查询所有电影
				var Moive = $resource('/api/movies');
				Moive.query(function(data){
					if(data.length > 0){
						$scope.Init.moviesData = data;
						console.log(data);
						filmStorage.setFilmStorage(data);
					}
				}, function(err){
					console.log(err)
				})
			}else{
				//如果已经有storage['film']
				$scope.Init.moviesData = filmStorage.getFilmStorage();
			}	
		}else{//不支持storage
			//查询所有电影
			var Moive = $resource('/api/movies');
			Moive.query(function(data){
				if(data.length > 0){
					$scope.Init.moviesData = data;
					console.log(data);
				}
			}, function(err){
				console.log(err)
			})
		}		
	}
	$scope.updateMovie = function(movieTitle){
		$location.path('/Welcome/FilmManager');
		eventEmmiter.toBroadcast('updateMovie', movieTitle)
	}
	$scope.openn = function (data) {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: '../../views/logIn.html',
			controller: 'ModalLogIn',
			size: 'sm',
			resolve: {
			}
		});
		modalInstance.result.then(function (data2) {
			console.log(data2);
		}, function () {
			console.log('打开失败')
		});
	};
}])

appController.controller('FilmManagerCtrl', ['$scope', '$resource','$uibModal','filmStorage', function($scope, $resource,$uibModal,filmStorage){
	$scope.movie = {}
	$scope.movie.movieRepaet = false;
	$scope.movie.showMore = false;
	$scope.postMovieData = function(){
		switch($scope.movie.movieRepaet){
			//更新操作
			case true:{
				console.log('Update...');
				var Moive = $resource('/api/movies/:title', {
					title: '@title'
				}, {
					update:{
						method: 'PUT'
					}
				});
				Moive.update({}, {
					title: $scope.movie.name,
					doctor: $scope.movie.doctor,
					language: $scope.movie.language,
					country: $scope.movie.country,
					summary: $scope.movie.summary,
					poster: $scope.movie.poster,
					flash: $scope.movie.source,
					year: $scope.movie.year
				}, function(data){
					console.log(data)
					// 打开提示 清空film localStorage
					$scope.openUpdate();						
					filmStorage.clearFilmStorage();
				}, function(err){
					console.log(err)
				})
			}break;
			//新增操作
			case false:{
				console.log('Adding...');
				var Moive = $resource('/api/movies');
				Moive.save({}, {
					title: $scope.movie.name,
					doctor: $scope.movie.doctor,
					language: $scope.movie.language,
					country: $scope.movie.country,
					summary: $scope.movie.summary,
					poster: $scope.movie.poster,
					flash: $scope.movie.source,
					year: $scope.movie.year
				}, function(data){
					console.log(data)
					// 打开提示 清空film localStorage
					$scope.openAddData();
					filmStorage.clearFilmStorage();
				}, function(err){
					console.log(err)
				})
			}
			break
		}
	}
	$scope.$on('updateMovie', function(eve,d){
		console.log('收到事件');
		$scope.movie.name = d;
		$scope.movie.showMore = true;
	})
	$scope.$watch('fileForm.$valid', function(n,o){
		if(n == true){
			$scope.movie.showMore = true;
		}else{
			$scope.movie.showMore = false;
		}
	})
	$scope.openUpdate = function (data) {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: '../../views/updateSuccess.html',
			controller: 'ModalupdateSuccess',
			size: 'sm',
			resolve: {
			}
		});
		modalInstance.result.then(function (data2) {
			console.log(data2);
		}, function () {
			console.log('打开失败')
		});
	}
	$scope.openAddData = function (data) {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: '../../views/addMovieSuccess.html',
			controller: 'ModalAddSuccess',
			size: 'sm',
			resolve: {
			}
		});
		modalInstance.result.then(function (data2) {
			console.log(data2);
		}, function () {
			console.log('打开失败')
		});
	}
}])

appController.controller('filmListCtrl', ['$scope', '$resource','filmStorage','$location', 'eventEmmiter', '$uibModal', function($scope, $resource, filmStorage, $location, eventEmmiter, $uibModal){
	$scope.fileList = {};
	$scope.fileList.moviesData = [];
	$scope.fileList.initData = function(){
		if(filmStorage.isSupportLocalStorage){//支持storage
			var hasFilm = filmStorage.hasFilmStorage();
			//如果没有storage['film']
			console.log("has localStorage['film']: " + hasFilm)
			if( hasFilm==false || hasFilm=='false' ){
				//查询所有电影
				var Moive = $resource('/api/movies');
				Moive.query(function(data){
					if(data.length > 0){
						$scope.fileList.moviesData = data;
						console.log(data);
						filmStorage.setFilmStorage(data);
					}
				}, function(err){
					console.log(err)
				})
			}else{
				//如果已经有storage['film']
				$scope.fileList.moviesData = filmStorage.getFilmStorage();
			}	
		}else{//不支持storage
			//查询所有电影
			var Moive = $resource('/api/movies');
			Moive.query(function(data){
				if(data.length > 0){
					$scope.fileList.moviesData = data;
					console.log(data);
				}
			}, function(err){
				console.log(err)
			})
		}	
	}	
	$scope.fileList.watchMovie = function(movieTitle){
		$location.path('/WatchMovie/'+ movieTitle)
	}
	$scope.updateMovie = function(movieTitle){
		$location.path('/Welcome/FilmManager');
		eventEmmiter.toBroadcast('updateMovie', movieTitle)
	}
	$scope.deleteMovie = function(movieTitle){
		var Movie = $resource('/api/movies/:theparam',{
			theparam: '@theparam'
		});
		Movie.remove({}, {
			theparam: movieTitle
		}, function(data){
			console.log(data)
			//清空本地缓存再重新加载
			filmStorage.clearFilmStorage();
			$scope.fileList.initData();
		}, function(err){
			console.log(err)
		})
	}
	$scope.open = function (data) {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: '../../views/model.html',
			controller: 'ModalDeleteOrNot',
			size: 'sm',
			resolve: {
			}
		});
		modalInstance.result.then(function (data2) {
			console.log(data2);
			$scope.deleteMovie(data);
		}, function () {
			console.log('删除失败')
		});
	};

}])

appController.controller('watchMovieCtrl', ['$scope','$stateParams','$resource','$sce', function($scope,$stateParams,$resource,$sce){
	$scope.movie = {};
	$scope.movie.p = $stateParams.movieTitle;
	$scope.movie.initMovieData = function(){
		var movieResource = $resource('/api/movies/:theparam', {
			theparam: '@theparam'
		})
		movieResource.get({
			theparam: $scope.movie.p
		}, function(data){
			$scope.movie.data = data.movie[0];
			$scope.movie.resourceUrl = $sce.trustAsResourceUrl(data.movie[0].flash);
		}, function(err){
			console.log(err)
		})
	}
	$scope.getTrustedHTML = function(str){
		return $sce.trustAsHtml(str);
	}

}])

appController.controller('logInCtrl', ['$scope','$resource', '$uibModal', 'Auth','$rootScope',function($scope ,$resource,$uibModal,Auth,$rootScope){
	$scope.open = function (data) {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: '../../views/logIn.html',
			controller: 'ModalLogIn',
			size: 'sm',
			resolve: {
			}
		});
		modalInstance.result.then(function (data2) {
			
		}, function () {
			console.log('打开失败')
		});
	};
	$scope.logout = function(){
		console.log('logging out..');
		//session logout
		var Users = $resource('/api/logout');
		Users.query(function(data){
			console.log(data)
			//cookie logout
			Auth.logOut();
			console.log('未登录')
			$rootScope.rootCtrlScope.username = null;
		}, function(err){
			console.log(err)
		})
	}
}])

appController.controller('ModalLogIn', ['$scope', '$uibModalInstance', '$resource', 'Auth','$q','$timeout','$interval','$rootScope','$location',function($scope,$uibModalInstance,$resource,Auth,$q,$timeout,$interval,$rootScope,$location){
	$scope.logIn = {};
	$scope.logIn.Title = "Welcome";
	$scope.logIn.smallTitle = "登录";
	$scope.time = 3;
	$scope.logIn.isLoggin = false;
	$scope.logIn.showTips = false;
	$scope.logIn.showTips2 = false;
	$scope.logIn.isPasswordTrue = true;
	$scope.ok = function () {
		var User = $resource('/api/signIn')
		User.save({}, {
			name: $scope.logIn.username,
			password: $scope.logIn.password
		}, function(data){
			if(data.user.length > 0 && data.user){
				console.log(data)
				console.log('用户存在');
				$scope.logIn.showTips = false;
				if(data.userState == '密码错误'){
					console.log('但密码错误')
					$scope.logIn.isPasswordTrue = false;
					$scope.logIn.showTips2 = true;
				}
				if(data.userState == '登录成功'){				
					//-------cookie---------
					var deferred = $q.defer();
					var promise = deferred.promise;
					promise.then(function(data1){
						//--------成功
						console.log(data1);
						$scope.logIn.Title = "欢迎回来";
						$scope.logIn.smallTitle = data.user[0].name;
						$scope.logIn.isLoggin = true;
						//根作用域
						$rootScope.rootCtrlScope.username = $scope.logIn.smallTitle;

						$interval(function(){
							$scope.time--;
						},1000)
						$timeout(function(){
							$uibModalInstance.close();
							//转到首页
							$location.path('/')
						}, 3000)
					}, function(err){
						console.log(err)
					})
					console.log(data)
					Auth.setUser(data.user[0], deferred);
				}
			}else{
				console.log('用户不存在')
				$scope.logIn.showTips = true;
			}
		}, function(err){
			console.log(err)
		})

	};
	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};

}])

appController.controller('ModalReg', ['$scope', '$uibModalInstance', '$timeout','$location','$interval', function($scope, $uibModalInstance,$timeout,$location,$interval){
	$scope.time = 3;
	$timeout(function(){
		$uibModalInstance.dismiss();
		$scope.time = 3;
		$location.path('/Welcome/index')
	}, 3000)
	$interval(function(){
		$scope.time--;
	}, 1000)

}])

appController.controller('ModalDeleteOrNot', ['$scope', '$uibModalInstance', function($scope, $uibModalInstance){
	$scope.ok = function () {
		$uibModalInstance.close('正在删除');
	};
	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};
}])

appController.controller('ModalupdateSuccess', ['$scope', '$uibModalInstance', '$timeout','$location','$interval', function($scope, $uibModalInstance,$timeout,$location,$interval){
	$scope.time = 2;
	$timeout(function(){
		$uibModalInstance.dismiss();
		$scope.time = 2;
		$location.path('/Welcome/FilmList');
	}, 1000)
	$interval(function(){
		$scope.time--;
	}, 1000)

}])
appController.controller('ModalAddSuccess', ['$scope', '$uibModalInstance', '$timeout','$location','$interval', function($scope, $uibModalInstance,$timeout,$location,$interval){
	$scope.time = 2;
	$timeout(function(){
		$uibModalInstance.dismiss();
		$scope.time = 2;
		$location.path('/Welcome/index');
	}, 1000)
	$interval(function(){
		$scope.time--;
	}, 1000)

}])



