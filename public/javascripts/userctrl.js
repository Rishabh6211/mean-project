var app = angular.module('validationApp', ['userservices']);
app.controller('regctrl', function($http, $scope) 
{
	this.register = function()
	 {
		console.log('success');
		//console.log(this.regData);
		$http.post('/signup', $scope.user);
		$http.post('/login', $scope.user);
		// check to make sure the form is completely valid
		/*if (isValid) { 
			alert('success');
		}*/

	};

});

