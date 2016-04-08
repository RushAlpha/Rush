angular.module('Rush', ['ui.router','rush-Services', 'owner-Module', 'consumer-Module'])
.config(function($stateProvider, $httpProvider, $urlRouterProvider){
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
	.state('owner', {
		url: '/owner',
		templateUrl: '../owner/owner.html',
		controller: 'ownerController'
	})
	.state('consumer', {
		url: '/consumer',
		templateUrl: '../consumer/consumer.html',
		controller: 'consumerController'
	})
})

.controller('authController', function($scope, authFactory, $state){
	$scope.logIn = function() {
		authFactory.postSignIn(
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
		authFactory.postSignUp($scope.username, $scope.password, $scope.isOwnerBox.value).then(function(data) {
				$state.go('owner')
			console.log("SignUp post successful!", data)
		})
	};
	$scope.isOwnerBox = {
		value: true
	}
})
