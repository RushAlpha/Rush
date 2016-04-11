angular.module('consumer-Module', ['rush-Services', 'ngGeolocation', 'uiGmapgoogle-maps'])
.controller('consumerController', function($scope, $geolocation){
	$scope.Welcome = "Welcome";
		$scope.locationExists = false;
		$scope.map;
		$scope.myPosition = {};
	   $geolocation.getCurrentPosition({
            timeout: 60000
         }).then(function(position) {
            $scope.myPosition.latitude = position.coords.latitude;
            $scope.myPosition.longitude = position.coords.longitude;
            $scope.locationExists = true;
         }).then(function(){
         	$scope.map = { center: { latitude: $scope.myPosition.latitude, longitude: $scope.myPosition.longitude }, zoom: 11 };
         })
         $scope.showLocation = function(){
         	console.log($scope.myPosition);
         }
});

         



// })


