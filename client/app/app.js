angular.module('Rush', ['ui.router', 'rush-Services', 'owner-Module', 'consumer-Module', 'uiGmapgoogle-maps', 'ngGeolocation', 'ngMaterial'])
	.config(function($stateProvider, $httpProvider, $urlRouterProvider) {
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
	.controller('authController', function($geolocation, $scope, authFactory, $state) {
			$scope.isOwnerBox = {
				value: false
			};
			$scope.location;
			$scope.geoAddress = {};
			var geocoder = new google.maps.Geocoder();

			$scope.logIn = function() {
				authFactory.postSignIn(
					$scope.username, $scope.password).then(function(data) {
					if(data.data.hasAccount === true){
						if(data.data.isOwner === true){
							console.log(data.data ,"THIS IS DATA.DATA!!!");

							$state.go('owner');
						} else {
							console.log(data.data ,"THIS IS DATA.DATA!!!");
							$state.go('consumer');
						}
					} else {
						alert('This account does not exist');
						$state.go('signup');
					}
				});
				console.log('username & password: ', $scope.username, $scope.password);
			}
			$scope.logUp = function() {

				if ($scope.isOwnerBox.value === true) {
					console.log('address: ', $scope.address)
					geocoder.geocode({
						"address": $scope.address
					}, function(results, status) {
						if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
							$scope.location = results[0].geometry.location;
							$scope.geoAddress.latitude = results[0].geometry.location.lat();
							$scope.geoAddress.longitude = results[0].geometry.location.lng();
							console.log("geoAddress#1: ", $scope.geoAddress);
							console.log("ISOWNERBOX VALUE!!!", $scope.isOwnerBox.value);

							authFactory.postSignUp($scope.username, $scope.password, $scope.isOwnerBox.value, $scope.geoAddress)
								.then(function(data) {
									if (data.data.isOwner === false) {
										console.log(data);
										$state.go('consumer');
									} else if (data.data.isOwner === true) {
										console.log(data);

										console.log("Successful logUp: ", $scope.username);
										$state.go('owner');
									} else {
										console.log(data.data);

										$state.go('signin');
									}
								});
						}
					});
					console.log("geoAddress#2: ", $scope.geoAddress);
				} else {
					authFactory.postSignUp($scope.username, $scope.password, $scope.isOwnerBox.value, $scope.address)
						.then(function(data) {
							if (data.data.isOwner === false) {
								console.log(data);
								$state.go('consumer');
							} else if (data.data.isOwner === true) {
								console.log(data);
								console.log("Successful logUp: ", $scope.username);
								$state.go('owner');
							} else {
								console.log(data.data);
								$state.go('signin');
							}
						});

				}
				console.log($scope.address);

			};
		})
