angular.module('Rush', ['ui.router',
	'rush-Services',
	'owner-Module',
	'consumer-Module',
	'uiGmapgoogle-maps',
	'ngGeolocation',
	'ngMaterial',
	'firebase'
])
	.config(function($stateProvider, $httpProvider, $urlRouterProvider, $mdIconProvider) {
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
				params: {
					geoAddress: null,
					username: null,
					password: null
				},
				templateUrl: '../owner/owner.html',
				controller: 'ownerController'
			})
			.state('consumer', {
				url: '/consumer',
				templateUrl: '../consumer/consumer.html',
				controller: 'consumerController'
			})

	$mdIconProvider
	  .icon('arrow', '../assets/arrows.svg')
	})
.controller('authController', function($geolocation, $scope, authFactory, $state, $firebaseAuth) {

	// function iconator($mdIcon){
	// 	$mdIcon('android').then(function(iconEl){ document.getElementByClassName("android").append(iconEl)})
	// }
	// iconator();
	$scope.authData;
	$scope.error;
	$scope.ref = new Firebase("https://fiery-inferno-8987.firebaseio.com");
	$scope.authObj = $firebaseAuth($scope.ref);
	$scope.isOwnerBox = {
		value: false
	};
	$scope.location;
	$scope.geoAddress = {};
	var geocoder = new google.maps.Geocoder();


	$scope.logIn = function() {
		authFactory.postSignIn(
			$scope.username, $scope.password).then(function(data) {
			if (data.data.hasAccount === true) {
				$scope.ref.authWithCustomToken(data.data.token, function(error, authData) {
					if (error) {
						$scope.error = error;
					} else {
						if (data.data.isOwner === true) {
							$state.go('owner');
						} else {
							$state.go('consumer');
						}
					}
				})
			} else {
				alert('This account does not exist');
				$state.go('signup');
			}
		});
	}
	$scope.logUp = function() {

		if ($scope.isOwnerBox.value === true) {
			geocoder.geocode({
				"address": $scope.address
			}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
					$scope.location = results[0].geometry.location;
					$scope.geoAddress.lat = results[0].geometry.location.lat();
					$scope.geoAddress.lng = results[0].geometry.location.lng();
					authFactory.postSignUp($scope.username, $scope.password, $scope.isOwnerBox.value, $scope.geoAddress, $scope.restName)
						.then(function(data) {

							$scope.ref.authWithCustomToken(data.data.token, function(error, authData) {
								if (error) {
								} else {
									$scope.authData = authData;

									if (data.data.isOwner === false) {
										$state.go('consumer');
									} else if (data.data.isOwner === true) {
										$state.go('owner', {
											geoAddress: $scope.geoAddress,
											username: $scope.username,
											password: $scope.password
										});
									} else {
										$state.go('signin');
									}
								}
							});
						});
				}
			})
		} else {
			authFactory.postSignUp($scope.username, $scope.password, $scope.isOwnerBox.value, $scope.address)
				.then(function(data) {
					$scope.ref.authWithCustomToken(data.data.token, function(error, authData) {
						if (error) {
							console.log('error');
						} else {
							if (data.data.isOwner === false) {
								$state.go('consumer');
							} else if (data.data.isOwner === true) {
								$state.go('owner');
							} else {
								$state.go('signin');
							}
						}
					});
				})

		};
	}
});
