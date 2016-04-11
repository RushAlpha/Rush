angular.module('Rush', ['ui.router','rush-Services', 'owner-Module', 'consumer-Module', 'uiGmapgoogle-maps', 'ngGeolocation'])
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
.controller('authController', function($geolocation, $scope, authFactory, $state){
	$scope.location;
	$scope.geoAddress = {};
	var geocoder = new google.maps.Geocoder();

	$scope.logIn = function() {
		authFactory.postSignIn(
			$scope.username, $scope.password).then(function(data) {
				console.log("postSignIn: ", data);
				if (data.data === true){
					$state.go('owner');
				} else if (data.data === false){
					$state.go('signin');
				} else {
					console.log("Not Found");
				}
		});
		console.log('username & password: ', $scope.username, $scope.password);
	}
	$scope.logUp = function() {
		console.log('address: ', $scope.address)
		geocoder.geocode( { "address": $scope.address }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
       	$scope.location = results[0].geometry.location;
       	$scope.geoAddress.latitude = results[0].geometry.location.lat();
       	$scope.geoAddress.longitude = results[0].geometry.location.lng();
       	console.log("geoAddress#1: ", $scope.geoAddress);
       	authFactory.postSignUp($scope.username, $scope.password, $scope.isOwnerBox.value, $scope.geoAddress)
				.then(function(data) {
					if (data.data === false){
						$state.go('signin');
					} else {
						console.log("Successful logUp: ", $scope.username);
						$state.go('owner');
					}
				});
      }
		});
		console.log("geoAddress#2: ", $scope.geoAddress);
	}
	console.log($scope.address);
	$scope.isOwnerBox = {
		value: false
	};
});
