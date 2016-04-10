angular.module('owner-Module', ['rush-Services', 'ngGeolocation'])
.controller('ownerController', ['$geolocation', '$scope', function($geolocation, $scope) {
         $geolocation.getCurrentPosition({
            timeout: 60000
         }).then(function(position) {
            $scope.myPosition = position;
         });

	$scope.map = { center: { latitude: 69.42042069, longitude: 69.42042069 }, zoom: 9.5 };
    }]);

