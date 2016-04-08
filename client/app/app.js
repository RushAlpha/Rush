angular.module('Rush', ['ui.router','Rush.services'])
.config(function($stateProvider, $httpProvider, $urlRouterProvider){
	console.log("config is running");
	$urlRouterProvider.otherwise('signin')

	$stateProvider
	.state('signin', {
		url: '/signin',
		templateUrl: '../views/signIn.html',
		controller: 'authController'
	})
	.state('signup', {
		url: '/signup',
		templateUrl: '../views/signUp.html',
		controller: 'authController'
	})
})

.controller('authController', function($scope, AuthFactory){
	$scope.logIn = function() {
		AuthFactory.postSignIn(
			$scope.username, $scope.password).then(function(err,data) {
			if(err) {
				console.log("LogIn post unsucessful!")
				return;
			}
			console.log("LogIn post successful!")
		});
		console.log($scope.username, $scope.password, "USERNAMES AND PASSWORDS");
	}
	$scope.logUp = function() {
		console.log("my owner box: ", $scope.isOwnerBox.value);
		AuthFactory.postSignUp($scope.username, $scope.password, $scope.isOwnerBox.value).then(function(data) {

			console.log("SignUp post successful!", data)
		})
	};
	$scope.isOwnerBox = {
		value: true
	}
})
.run(function(){
	console.log("it's running")
})
