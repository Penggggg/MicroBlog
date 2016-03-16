var appDirective = angular.module('appDirective', [])

appDirective.directive("isRepeat", function($resource){
	return {
		restrict: 'AE', 
		require: 'ngModel',
		link: function(scope, element, attrs, ctrl){
			//根据查询对象不同监听不同对象
			switch(attrs['repeatType']){
				case 'user':{
					scope.$watch('reg.nameIsValid', function(newVal){
						if(!newVal){
							ctrl.$setValidity('checkName', false);
						}else{
							ctrl.$setValidity('checkName', true);
						}
					})					
				}
				break;
				case 'movie':{
					scope.$watch('movie.movieRepaet', function(newVal){
						if(newVal){
							ctrl.$setValidity('title', true);
						}else{
							ctrl.$setValidity('title', true);
						}
					})						
				}
				break;
			}
			//检查电影名称
			scope.$watch('movie.name', function(n, o){
				//若用户名非空
				if(element.val()){
					console.log('Checking name..');
					//生成一个resource
					var	Resource = $resource(attrs['isRepeat'], {
						theparam: '@theparam'
					})
					//RESTful action
					Resource.get({
						theparam: element.val()
					}, function(data){
						//根据查询对象不同获取不同结果

								if(data.movie.length > 0){
									console.log('找到重复');
									scope.movie.dataFromDB = data.movie[0];
									scope.movie.movieRepaet = true;
									//把数据放到表单上
									scope.movie.doctor = scope.movie.dataFromDB.doctor;
									scope.movie.language = scope.movie.dataFromDB.language;
									scope.movie.country = scope.movie.dataFromDB.country;
									scope.movie.summary = scope.movie.dataFromDB.summary;
									scope.movie.poster = scope.movie.dataFromDB.poster;
									scope.movie.source = scope.movie.dataFromDB.flash;
									scope.movie.year = scope.movie.dataFromDB.year;
									
								}else{
									console.log('找不到重复');
									scope.movie.movieRepaet = false;
									//清空表单上的数据
									scope.movie.doctor = null;
									scope.movie.language = null;
									scope.movie.country = null;
									scope.movie.summary = null;
									scope.movie.poster = null;
									scope.movie.source = null;
									scope.movie.year = null;									
								}								
							
							
						
					}, function(err){
						console.log(err)
					})

				}
			})
			//检查用户名
			scope.$watch('reg.username', function(n, o){
				//若用户名非空
				if(element.val()){
					console.log('Checking name..');
					//生成一个resource
					var	Resource = $resource(attrs['isRepeat'], {
						theparam: '@theparam'
					})
					//RESTful action
					Resource.get({
						theparam: element.val()
					}, function(data){
						//根据查询对象不同获取不同结果
					
								if(data.user.length > 0){
									console.log('找到重复');
									scope.reg.nameIsValid = false;
									scope.reg.showTips = true;
								}else{
									console.log('找不到重复');
									scope.reg.nameIsValid = true;
									scope.reg.showTips = false;
								}
							
							
						
					}, function(err){
						console.log(err)
					})

				}
			})
		}
	}
})

appDirective.directive("checkPasswordRepeat", function(){
	return {
		restrict: 'AE', 
		require: 'ngModel',
		link: function(scope, element, attrs, ctrl){
			scope.$watch('reg.passwordRepeate', function(newVal){
				if(scope.reg.password != null){
					if(newVal == scope.reg.password){
						ctrl.$setValidity('checkPasswordRepeat', true);
					}else{
						ctrl.$setValidity('checkPasswordRepeat', false);
					}
				}
			})
			scope.$watch('reg.password', function(newVal){
				if(scope.reg.passwordRepeate != null){
					if(newVal == scope.reg.passwordRepeate){
						ctrl.$setValidity('checkPasswordRepeat', true);
					}else{
						ctrl.$setValidity('checkPasswordRepeat', false);
					}
				}
			})
		}
	}
})

appDirective.directive("checkLogInName", function(){
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, ele, attrs, ctrl){
			scope.$watch('logIn.showTips', function(n ,o){
				if(n){
					ctrl.$setValidity('checkLogInName', false)
				}
			})
			scope.$watch('logIn.username', function(n, o){
				ctrl.$setValidity('checkLogInName', true);
				scope.logIn.showTips = false;
			})
		}
	}
})

appDirective.directive("checkLogInPassword", function(){
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, ele, attrs, ctrl){
			scope.$watch('logIn.isPasswordTrue', function(n ,o){
				if(!n){
					console.log(n)
					ctrl.$setValidity('checkLogInPassword', false)
				}
			})
			scope.$watch('logIn.password', function(n, o){
				ctrl.$setValidity('checkLogInPassword', true)
				scope.logIn.showTips2 = false;				
			})
		}
	}
})






