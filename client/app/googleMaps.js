angular.module('maps-module', ['uiGmapgoogle-maps', 'ngGeolocation'])
.controller('googleMapsController', ['$geolocation', '$scope', function($geolocation, $scope) {
         $geolocation.getCurrentPosition({
            timeout: 60000
         }).then(function(position) {
            $scope.myPosition = position;
         });
	$scope.map = { center: { latitude: 69.42042069, longitude: 69.42042069 }, zoom: 9 };
    }]);
 


