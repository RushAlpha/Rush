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
		console.log("THIS IS THE ADDRESS", $scope.address)
		geocoder.geocode( { "address": $scope.address }, function(results, status) {
       if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
       	 $scope.location = results[0].geometry.location;
       	 $scope.geoAddress.latitude = results[0].geometry.location.lat();
       	 $scope.geoAddress.longitude = results[0].geometry.location.lng();
       	 console.log("GEOADDRESS1", $scope.geoAddress);

       	 		authFactory.postSignUp($scope.username, $scope.password, $scope.isOwnerBox.value, $scope.geoAddress)
		.then(function(data) {
				if (data.data === false){
					$state.go('signin');
				} else {
					console.log("ITS WORKING");
					$state.go('owner');
				}
		})

       }
		});
		console.log("GEOADDRESS", $scope.geoAddress);

	};
	console.log($scope.address);
	$scope.isOwnerBox = {
		value: false
	}



})
