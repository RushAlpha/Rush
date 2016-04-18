angular.module('owner-Module', ['rush-Services', 'ngGeolocation', 'uiGmapgoogle-maps', 'ngMaterial', 'firebase'])
	.controller('ownerController', function($geolocation, $scope, generalFactory, $state, $firebaseAuth, $filter) {

		$scope.map = {
			center: { latitude: null, longitude: null },
			zoom: 10
		};
		$scope.newCenter= {};
		$scope.uid;
		$scope.restName;
		var ref = new Firebase("https://fiery-inferno-8987.firebaseio.com");
		$scope.authObj = $firebaseAuth(ref);
		$scope.rushes = [];
		$scope.decItems = [];

		$scope.checkAuthentication = function() {
			$scope.authObj.$onAuth(function(authData) {
				if (authData) {
					$scope.uid = authData.auth.uid;
					generalFactory.getOwnerLocation($scope.uid).then(function(location) {
						$scope.newCenter.latitude = location.data.address.location.lat;
						$scope.newCenter.longitude = location.data.address.location.lng;

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
				$scope.restName = deals.data.restName;
			})
		}

		$scope.getDeals();
		$scope.declareRush = function() {
			$scope.decItems = $filter('filter')($scope.rushes, {checked: true})
			generalFactory.declareRush($scope.uid, $scope.decItems);
			console.log("declaredRush! rushDeals: ", $scope.decItems);
			alert("rushDeclared!");
		};

		$scope.addToDeals = function() {
			generalFactory.addToDeals($scope.uid, $scope.item, $scope.price)
				.then(function(data) {
					console.log("deals added! yourDeals: ", data);
					$scope.rushes.push({
						item: data.item,
						price: data.price
					});
					$state.reload();
				})
		}
	});
