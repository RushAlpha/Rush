angular.module('Rush', ['ui.router','rush-Services', 'owner-Module', 'consumer-Module', 'maps-module', 'uiGmapgoogle-maps'])
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
			$scope.username, $scope.password).then(function(data) {
				console.log("this is data line 32", data);
				if (data.data === true){
					$state.go('owner');
				} else if (data.data === false){
					$state.go('signin');
				} else {
					console.log("data not found");
				}
		});
		console.log($scope.username, $scope.password, "USERNAMES AND PASSWORDS");
	}
	$scope.logUp = function() {
		authFactory.postSignUp($scope.username, $scope.password, $scope.isOwnerBox.value, $scope.address)
		.then(function(data) {
				if (data.data === false){
					$state.go('signin');
				} else {
					$state.go('owner');
				}
		})
	};
	console.log($scope.address);
	$scope.isOwnerBox = {
		value: false
	}
})
