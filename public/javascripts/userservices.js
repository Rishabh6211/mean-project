angular.module('userservices',[])
	.factory('User',function()
		{
			userFactory ={};
			userFactory.create = function($http)
			{
				return $http.post('/signup',$scope.user);
			}
			return userFactory;
		});