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
			.state('reviewBox', {
				url: '/reviewBox',
				reloadOnSearch: true,
				templateUrl: '../consumer/reviewBox.html',
				controller: 'consumerController'
			})
			.state('reviews', {
				url: '/reviews/',

				templateUrl: '../consumer/reviews.html',
				controller: 'reviewController'
			})
			.state('yelpForm', {
				url: '/yelpForm',
				templateUrl: '../views/yelpForm.html',
				controller: 'authController'
			})

	$mdIconProvider
	  .icon('arrow', '../assets/arrows.svg')
	})
.controller('authController', function($geolocation, $scope, authFactory, $state, $firebaseAuth) {

	$scope.authData;
	$scope.error;
	//this makes the connection to firebase
	$scope.ref = new Firebase("https://blazing-fire-9069.firebaseio.com");
	$scope.authObj = $firebaseAuth($scope.ref);
	$scope.isOwnerBox = {
		value: false
	};
	$scope.onYelp = {
		value: false
	};
	$scope.location;
	$scope.geoAddress = {};

	var geocoder = new google.maps.Geocoder();

	//logs them in, gives a token if successful, checks if username exists in database and if password matches username
	//if login fails then itll redirect to signup page
	$scope.logIn = function() {
		authFactory.postSignIn(
			$scope.username, $scope.password).then(function(data) {
			if (data.data.hasAccount === true) {
				$scope.ref.authWithCustomToken(data.data.token, function(error, authData) {
					if (error) {
						$scope.error = error;
					} else {
						if (data.data.isOwner === true) {
							$state.go('owner'); /// prbably the problem is here
						} else {
							$state.go('consumer'); //probably the problem is here
						}
					}
				})
			} else {
				alert('This account does not exist');
				$state.go('signup');
			}
		});
	}
	//this will geocode an owners address and will not geocode if the person does not check the checkbox
	//authorizes the user with a token if signp successful and sends them to the correct page
	$scope.logUp = function() {

			if ($scope.isOwnerBox.value === true && $scope.onYelp.value ===false) {
				console.log("Not on yelp");
				geocoder.geocode({
					"address": $scope.address
				}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
						$scope.location = results[0].geometry.location;
						$scope.geoAddress.lat = results[0].geometry.location.lat();
						$scope.geoAddress.lng = results[0].geometry.location.lng();
						authFactory.postSignUp($scope.username, $scope.password, $scope.isOwnerBox.value, $scope.geoAddress, $scope.restName, $scope.address)
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
		} if ($scope.isOwnerBox.value === true && $scope.onYelp.value ===true) {
			console.log("Im on Yelp!")
			geocoder.geocode({
				"address": $scope.address
			}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
					$scope.location = results[0].geometry.location;
					$scope.geoAddress.lat = results[0].geometry.location.lat();
					$scope.geoAddress.lng = results[0].geometry.location.lng();

					authFactory.postYelpSignUp($scope.username, $scope.password, $scope.isOwnerBox.value, $scope.geoAddress, $scope.restName, $scope.address)
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
		}else {
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
	//// review box
	}
});



// <<<<<<< Updated upstream
// 	}
// =======
// 	    $scope.showAdvanced = function(ev) {
// 	      console.log("signup Controller show advanced function")
// 	      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
// 	      $mdDialog.show({

// 	        templateUrl: '../views/yelpForm.html',
// 	        parent: angular.element(document.body),
// 	        targetEvent: ev,
// 	        clickOutsideToClose:true,
// 	        fullscreen: useFullScreen
// 	      })


// 	    }


// 	    $scope.yelpData = function() {
//     		var yelpData = {};
//       	yelpData.name = $scope.restName;
//       	yelpData.address = $scope.address;


//       	authFactory.yelpRest(yelpData).then(function(res){
//         	$scope.yelpRestName = res.data.name;
//         	$scope.yelpRating = res.data.rating;
//         	$scope.yelpLocation = res.data.location.display_address[0] + res.data.location.display_address[1] + res.data.location.display_address[2];
//           console.log(res);
//           })
//           .then(function(res){
//       	    console.log("This is scope array", $scope.array);
//           });
//       	// authFactory.yelpRest().then(function(res){
//       	// $scope.array = res;
//       	// console.log($scope.array);
//       // });
//     };

// >>>>>>> Stashed changes

//



