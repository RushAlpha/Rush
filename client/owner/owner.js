angular.module('owner-Module', ['rush-Services', 'ngGeolocation', 'uiGmapgoogle-maps'])
.controller('ownerController', function($geolocation, $scope, generalFactory) {
	$scope.map = { center: { latitude: 34.2837189, longitude: -118.10385710 }, zoom: 9 };

	$scope.declareRush = function(){
		console.log("declaredRush!");
	}

	$scope.addToDeals = function(){
   	  generalFactory.addToDeals($scope.item, $scope.price)
  	}

});

