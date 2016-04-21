angular.module('consumer-Module', ['rush-Services', 'ngGeolocation', 'uiGmapgoogle-maps', 'firebase'])
   .controller('consumerController', function($scope, $geolocation, generalFactory, $firebaseAuth, $state, $mdDialog, $mdMedia) {
      $scope.Welcome = "Welcome";
      $scope.uid;

      var ref = new Firebase("blazing-fire-9069.firebaseio.com");
      $scope.authObj = $firebaseAuth(ref);
      $scope.locationExists = false;

      $scope.myPosition = {};
      $scope.distance;
      $scope.rushRestaurants;
      $scope.rushPositions=[];
      //gets consumer geolcoation sets their geolocation to map center and current position, then it calls filter positions
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
         $scope.currentPositions = {
            latitude: $scope.myPosition.lat,
            longitude: $scope.myPosition.lng
         }
         $scope.filterPositions();
      })

      //when controller loads, this will check whether the user is authenticated.
      $scope.checkAuthentication = function() {
         $scope.authObj.$onAuth(function(authData) {
            if (authData) {
               $scope.uid = authData.auth.uid;
            } else {
               $state.go('signin');
            }
         })
      }
      $scope.checkAuthentication();
      $scope.rushRestaurants = [];
      //checks if the owners are in a 5 mile radius from the business and sends those restaurants to the view.
      $scope.counter = 2;
      $scope.filterPositions = function() {
         $scope.restReview = [];

         generalFactory.getRushes()
            .then(function(businessInfo) {
               console.log("business data", businessInfo.data);
               for (var i = 0; i < businessInfo.data.length; i++) {
                  console.log("Positions", $scope.myPosition, businessInfo.data[i].location)
                  $scope.distance = generalFactory.findDistance($scope.myPosition, businessInfo.data[i].location);
                  if ($scope.distance <= 8046.72) {
                     $scope.temporary = {latitude: businessInfo.data[i].location.lat,
                     longitude: businessInfo.data[i].location.lng
                  }
                     $scope.counter++;
                     var tempObj = {
                        id: $scope.counter,
                        restName: businessInfo.data[i].restName,
                        deals: businessInfo.data[i].deals,
                        address: $scope.temporary,
                        businessId: businessInfo.data[i].id,
                        reviews: businessInfo.data[i].reviews,
                        yelpReview: businessInfo.data[i].yelpReview,
                        yelpPicture: businessInfo.data[i].yelpPicture

                     }
                     console.log('obj', tempObj)
                     $scope.rushRestaurants.push(tempObj);
                  }
               }
            })
      }


        //get and store the id of clicked restaurant
      $scope.grabId = function(input) {
        localStorage.setItem('username', input);
        $scope.sortReviews(localStorage.getItem('username'));
      };

        //compare the id and get the review of clicked restaurant
      $scope.sortReviews = function(input) {
         $scope.rushRestaurants.forEach(function(currentEl){
            if(currentEl.businessId === input) {
              localStorage.setItem('tempReviews', JSON.stringify(currentEl.reviews));
              localStorage.setItem('tempBusinessName', currentEl.restName);
              // console.log("restaurants", $scope.rushRestaurants)
              // console.log('currentEl id', currentEl.businessId);
              // console.log('input', input);
              // console.log('review', currentEl.reviews)
            }
         });
      };

      $scope.reviewPost = function() {
        var userReview = {
          user: $scope.user.name,
          review: $scope.user.review,
          businessId: localStorage.getItem('username')
        };
       //console.log("sent this review", userReview)
       generalFactory.postReview(userReview);
      }


   $scope.showAdvanced = function(ev) {
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
    $mdDialog.show({
      controller: $scope.DialogController,
      templateUrl: 'consumer/reviewBox.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      fullscreen: useFullScreen
    })

    $scope.$watch(function() {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function(wantsFullScreen) {
      $scope.customFullscreen = (wantsFullScreen === true);
    });
  };

   $scope.showAdvanced2 = function(ev) {
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
    $mdDialog.show({
      controller: $scope.DialogController,
      templateUrl: 'consumer/reviews.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      fullscreen: useFullScreen
    })

    $scope.$watch(function() {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function(wantsFullScreen) {
      $scope.customFullscreen = (wantsFullScreen === true);
    });
  };

   $scope.DialogController = function($scope, $mdDialog) {
      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.answer = function(answer) {
        $mdDialog.hide(answer);
      };
   }
})
.controller('reviewController', function($scope, $state, $mdDialog, $mdMedia) {
   $scope.thisRestName = localStorage.getItem('tempBusinessName')
   $scope.thisReviews = JSON.parse(localStorage.getItem('tempReviews'));
});


