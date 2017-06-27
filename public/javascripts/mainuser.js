angular.module('authservices',[])
	.factory('authuser',function()
		{
			authuserFactory ={};
			userFactory.create = function($http)
			{
				return $http.post('/login',$scope.user);
			}
			return userFactory;
		});