angular.module('owner-Module', ['rush-Services', 'ngGeolocation', 'uiGmapgoogle-maps', 'ngMaterial'])
.controller('ownerController', function($geolocation, $scope, generalFactory) {
	$scope.map = { center: { latitude: 34.2837189, longitude: -118.10385710 }, zoom: 9 };

  $scope.rushes = [{item: "apple", price: 5}, {item: "pear", price: 6}, {item: "paper", price: 6}, {item: "eggroll", price: 6}, {item: "panda", price: 6} ];

	$scope.declareRush = function(){
		console.log("declaredRush!");
	};

	$scope.addToDeals = function(){
   	generalFactory.addToDeals($scope.username, $scope.password, $scope.item, $scope.price)
  }

  $scope.getDeals = function(){

  }
});
