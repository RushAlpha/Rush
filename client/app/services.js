angular.module('rush-Services', ['uiGmapgoogle-maps'])
    .config(function(uiGmapGoogleMapApiProvider){
        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyAxc_VeKSzM0c-5IOGE8mk-zLigL3QqEYA',
            v: '3.17',
            libraries: 'weather,geometry,visualization'
        });
    })
  .factory('authFactory', function($http) {
    var uid = 0;
    var makeToken = function(){
      uid += 1;
      console.log("THIS IS UID", uid);
      return $http.post('/token', {uid: uid});
    }
    var postSignIn = function(username, password) {
      var logInInfo = {
        username: username,
        password: password
      };
      return $http.post('/signin', logInInfo);
    };
    var postSignUp = function(username, password, isOwner, address, restName) {
      console.log('authFactory>postSignUp: ', username, password, isOwner, address, restName);
      var logUpInfo = {
        username: username,
        password: password,
        isOwner: isOwner,
        address: address,
        restName: restName
      };
      return $http.post('/signup', logUpInfo);
    }
    var getOwnerAddress = function(username){
      $http.post('/ownerAddress', {username: username});

    }
    return {
      getOwnerAddress: getOwnerAddress,
      postSignIn: postSignIn,
      postSignUp: postSignUp,
      makeToken: makeToken
    };
  })

  .factory('generalFactory', function($http) {
    var findDistance = function(latlng1, latlng2) {
        console.log("FINDING DISTANCE RIGHT NOW");
        var latitLongit1 = new google.maps.LatLng(latlng1);
        var latitLongit2 = new google.maps.LatLng(latlng2);
        console.log( google.maps.geometry.spherical.computeDistanceBetween(latitLongit1, latitLongit2));
        return google.maps.geometry.spherical.computeDistanceBetween(latitLongit1, latitLongit2);
    }
    var getRushes = function(){
      return $http.get('/getRushes');
    }

    var getDeals = function(){
      return $http.get('/ownerDeals');
    }
    var getOwnerLocation = function(uid){
      return $http.post('/getOwnerLocation', {uid: uid});
    }
    var addToDeals = function(uid, item, price) {
      var deal = {
        uid: uid,
        item: item,
        price: price
      };
      console.log("addToDeals: ", deal);
      return $http.post('/ownerAddItemToMenu', deal);
    }
    return {
      getDeals: getDeals,
      addToDeals: addToDeals,
      getRushes: getRushes,
      findDistance: findDistance,
      getOwnerLocation: getOwnerLocation
    }
  });
