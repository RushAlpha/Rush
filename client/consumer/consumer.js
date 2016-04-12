angular.module('consumer-Module', ['rush-Services', 'ngGeolocation', 'uiGmapgoogle-maps'])
.controller('consumerController', function($scope, $geolocation, generalFactory){
	$scope.Welcome = "Welcome";
		$scope.locationExists = false;
		$scope.map;
		$scope.myPosition = {};
      $scope.distance;
      $scope.rushRestaurants;
	   $geolocation.getCurrentPosition({
            timeout: 60000
         }).then(function(position) {
            $scope.myPosition.lat = position.coords.latitude;
            $scope.myPosition.lng = position.coords.longitude;
            $scope.locationExists = true;
         }).then(function(){
         	$scope.map = { center: { latitude: $scope.myPosition.lat, longitude: $scope.myPosition.lng }, zoom: 11 };
         })
         $scope.showLocation = function(){
         	console.log($scope.myPosition);
         }
         $scope.filterPositions = function(){
            console.log($scope.myPosition);
            console.log("Click is working");
            $scope.rushRestaurants = [];
            generalFactory.getLocations()
            .then(function(businessInfo){
               console.log("returning businessInfodata[i]", businessInfo.data[0]);
               for (var i = 0; i < businessInfo.data.length; i++){
                  console.log("SENDING INFORMATION TO FIND DISTANCE", $scope.myPosition, businessInfo.data[i].location)
                  $scope.distance = generalFactory.findDistance($scope.myPosition, businessInfo.data[i].location);
                  console.log("Distance between two points:", $scope.distance)
                  if ($scope.distance <= 8046.72   ){
                     console.log(businessInfo.data[i].deals);
                     $scope.rushRestaurants.push(businessInfo.data[i].deals);
                  }
               }
            })
         }
});

         



// })


