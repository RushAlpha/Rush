angular.module('owner-Module', ['rush-Services', 'ngGeolocation', 'uiGmapgoogle-maps', 'ngMaterial', 'firebase'])
	.controller('ownerController', function($geolocation, $scope, generalFactory, $state, $firebaseAuth) {

		$scope.map = {
			center: { latitude: null, longitude: null },
			zoom: 10
		};
		$scope.uid;
		var ref = new Firebase("https://fiery-inferno-8987.firebaseio.com");
		$scope.authObj = $firebaseAuth(ref);
		$scope.rushes = [];
		$scope.checkAuthentication = function() {
			$scope.authObj.$onAuth(function(authData) {
				if (authData) {
					$scope.uid = authData.auth.uid;
					generalFactory.getOwnerLocation($scope.uid).then(function(location) {
						$scope.map.center.latitude = location.data.address.location.lat;
						$scope.map.center.longitude = location.data.address.location.lng;
					})
				} else {
					$state.go('signin');
				}
			})
		}
		$scope.checkAuthentication();
		$scope.getDeals = function() {
			generalFactory.getDeals().then(function(deals) {
				$scope.rushes = deals.data.deals;
			})
		}
		$scope.getDeals();
		$scope.map;
		if ($state.params.geoAddress !== null) {
			$scope.newCenter = {
				latitude: $state.params.geoAddress.lat,
				longitude: $state.params.geoAddress.lng
			};
			$scope.map = {
				center: $scope.newCenter,
				zoom: 9
			};
		}
		$scope.declareRush = function() {
			console.log("declaredRush!", $state.params.geoAddress);
		};

		$scope.addToDeals = function() {
			generalFactory.addToDeals($scope.uid, $scope.item, $scope.price)
				.then(function(data) {
					console.log("deals are added, here are new deals", data);
					$scope.rushes.push({
						item: data.item,
						price: data.price
					});
					$scope.getDeals();
				})
		}
	});