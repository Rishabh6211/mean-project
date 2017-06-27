var app = angular.module("myApp", ['ngRoute', 'ngResource','ngFileUpload']);
app.config(function($routeProvider) {
    $routeProvider
     .when("/activity", {
        templateUrl : "/../user/activity.html",
        controller : "activityCtrl"
    })
     .when("/order", {
        templateUrl : "/../user/order.html",
        controller : "orderCtrl"
    })
     .when("/dashboard", {
        templateUrl : "/../user/dashboard.html",
        controller : "dashboardCtrl"
    })
    .when("/login", {
        templateUrl : "/../user/login.html",
        controller : "loginCtrl"
    })
    .when("/signup", {
        templateUrl : "/../user/signup.html",
        controller : "signupCtrl"
    })
     .when("/product", {
        templateUrl : "/../user/product.html",
        controller:"productCtrl"
    })
     .when("/image", {
        templateUrl : "/../user/image.html",
        controller:"imgCtrl"
    })
     .when("/logout", {
        controller:"containerCtrl"
    })
      .when("/home", {
        templateUrl : "home.html",
        controller:"homeCtrl"
    })
    .otherwise ('/login');
});


app.controller("productCtrl", function ($scope,$http) {
 
   $http.get("/product")
    .success(function(products)
    {
        $scope.products = products;

    });
    $scope.select = function(product)
    {
        $scope.product = product;
        console.log(product);
    }
    $scope.order = function()
    {
         alert("purchased Successfully");
        $http.post('/order', $scope.product)
        .success(function(orders){

            $scope.orders = orders;
            console.log(orders);
              
        });
    }

    /*$scope.add = function()
    {
        $http.post('/add' , $scope.userm).success(function(data)
            {
                console.log(data);
            });
    }*/
});
app.controller("activityCtrl", function($scope,$http,$window){
    $http.get("/activity").success(function(products)
        {
        $scope.products = products;
        });
    $scope.select = function(product)
    {
        $scope.product = product;
    }
     $scope.update = function()
    {
        console.log("inside update");
        $window.alert("working");
        $http.put('/update', $scope.product).success(function(data)
            {
                console.log(data);
                
            });

    }
    $scope.add = function()
    {

        console.log("inside add")
        $http.post('/add', $scope.product).success(function(data)
        {
            console.log(data);
        });
    }
    
});
app.controller("loginCtrl", function ($scope,$location,$rootScope,$http) {
    $scope.msg = "success";
    $scope.register = function()
     {
        
        console.log("Name",$scope.user);
        $http.post("/login", $scope.user).success(function(data) {
            $rootScope.user = data;
            $location.path('/image')
            console.log("dfgdfgdf",data)
        }).error(function(data){
            $location.path('/signup')
            alert("please register first self");
            
        });

    }
});
app.controller("signupCtrl", function ($scope,$location,$http) {
    $scope.msg = "success";
    $scope.register = function()
     {
        console.log("Name",$scope.user);
        // console.log("password",$scope.user.password);
        // console.log("email",$scope.user.email);
        //console.log ({username: $scope.username, password: $scope.password, email: $scope.email});
        $http.post("/signup", $scope.user).success(function(data) {
            alert("register Successfully");
            $location.path('/login')
        }).error(function(data){
            console.error('Report error: '+ data);
        });
        // check to make sure the form is completely valid
        /*if (isValid) { 
            alert('success');
        }*/
    }
    
});

app.controller('imgCtrl',function($scope,$http,Upload,$window,$location){
    $scope.submit = function(){ //function to call on form submit
        console.log($scope.file);
         $scope.upload($scope.file); //call upload function
    }
    
    $scope.upload = function (file) {
         console.log("upload");
        Upload.upload({
            url: 'http://localhost:3000/upload', //webAPI exposed to upload the file
            data:{file:file} //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if(resp.data.error_code === 0){ //validate success
                $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
            } else {
                $window.alert('an error occured');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            $window.alert('Error status: ' + resp.status);
        }, function (evt) { 
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };
});
app.controller('containerCtrl',function($scope,$location,$http,$rootScope)
    {
        $scope.logout=function(){
        $http.post("/logout").success(function(data)
        {
            $rootScope.user = null;
            
            $location.path('/login')
        });
    }
    });
app.controller('dashboardCtrl',function($scope,$http)
    {
        
         $http.get("/dashboard")
    .success(function(users)
    {
        $scope.users = users;
        console.log("inside dashboard");
    });
     $scope.select = function(userm)
    {
        $scope.userm = userm;
        console.log("inside select");
    }
    $scope.remove = function()
    {
       alert('remove Successfully')
        $http.post('/remove',$scope.userm).success(function(data){
            console.log("inside remove");
            console.log(data);
              
        });
    }
    });




