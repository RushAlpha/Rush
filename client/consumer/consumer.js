angular.module('consumer-Module', ['rush-Services', 'ngGeolocation', 'uiGmapgoogle-maps', 'firebase'])
   .controller('consumerController', function($scope, $geolocation, generalFactory, $firebaseAuth, $state) {
      $scope.Welcome = "Welcome";
      $scope.uid;
      var ref = new Firebase("https://fiery-inferno-8987.firebaseio.com");
      $scope.authObj = $firebaseAuth(ref);
      $scope.checkAuthentication();
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
      }).then(function() {
         $scope.map = {
            center: {
               latitude: $scope.myPosition.lat,
               longitude: $scope.myPosition.lng
            },
            zoom: 11
         };
      })
      $scope.checkAuthentication = function() {
         $scope.authObj.$onAuth(function(authData) {
            if (authData) {
               $scope.uid = authData.auth.uid;
            } else {
               $state.go('signin');
            }
         })
      }
      $scope.filterPositions = function() {
         $scope.rushRestaurants = [];
         generalFactory.getRushes()
            .then(function(businessInfo) {
               for (var i = 0; i < businessInfo.data.length; i++) {
                  $scope.distance = generalFactory.findDistance($scope.myPosition, businessInfo.data[i].address);
                  if ($scope.distance <= 8046.72) {

                     $scope.rushRestaurants.push(businessInfo.data[i].deals);
                  }
               }
            })
      }
   });



// })