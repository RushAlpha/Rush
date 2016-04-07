angular.module('app', [])
.config(function($stateProvider, $httpProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('signin')

	$stateProvider
	.state('signin', {
		url: '/signin',
		templateUrl: '../signin.html',
		controller: 'signinController'
	})
	.state('signup', {
		url: '/signup',
		templateUrl: '../signup.html',
		controller: 'signupController'
	})
})
.controller('signin', function($scope){

	$scope.signInCall(){

	}
})
