angular.module('maps-module', ['uiGmapgoogle-maps', 'ngGeolocation'])
.controller('tutorialController', function($scope){
	$scope.map = { center: { latitude: 69.42042069, longitude: 69.42042069 }, zoom: 9 };
})
    .controller('geolocationController', ['$geolocation', '$scope', function($geolocation, $scope) {
         $geolocation.getCurrentPosition({
            timeout: 60000
         }).then(function(position) {
            $scope.myPosition = position;
         });
    }]);