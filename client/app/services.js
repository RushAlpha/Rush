angular.module('rush-Services', ['uiGmapgoogle-maps'])
    .config(function(uiGmapGoogleMapApiProvider){
        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyAxc_VeKSzM0c-5IOGE8mk-zLigL3QqEYA',
            v: '3.17',
            libraries: 'weather,geometry,visualization'
        });
    })
  .factory('authFactory', function($http) {
    //Sends log in info to server
    var postSignIn = function(username, password) {
      var logInInfo = {
        username: username,
        password: password
      };
      return $http.post('/signin', logInInfo);
    };
    //Sends sign up info to server
    //restName is restaurant name
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
    //Sends owner's address to server
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
    //Finds the distance between the restaurant and consumer
    var findDistance = function(latlng1, latlng2) {
        console.log("FINDING DISTANCE RIGHT NOW");
        var latitLongit1 = new google.maps.LatLng(latlng1);
        var latitLongit2 = new google.maps.LatLng(latlng2);
        console.log( google.maps.geometry.spherical.computeDistanceBetween(latitLongit1, latitLongit2));
        return google.maps.geometry.spherical.computeDistanceBetween(latitLongit1, latitLongit2);
    }
    //Gets rushes for Consumer
    var getRushes = function(){
      return $http.get('/getRushes');
    }
    //Gets deals for owner
    var getDeals = function(){
      return $http.get('/ownerDeals');
    }
    //Gets owner locations
    var getOwnerLocation = function(uid){
      return $http.post('/getOwnerLocation', {uid: uid});
    }
    //Adds new deal for Owner and sends to server
    var addToDeals = function(uid, item, price) {
      var deal = {
        uid: uid,
        item: item,
        price: price
      };
      console.log("addToDeals: ", deal);
      return $http.post('/ownerAddItemToMenu', deal);
    }
    //Declares a rush on items in an array and sends to server
    var declareRush = function(uid, array) {
      var declaredRush = {
        uid: uid,
        rushDeals: array
      }
      console.log("Declaring this rush: ", declaredRush)
      return $http.post('/declareRush', declaredRush)
    }
    return {
      getDeals: getDeals,
      addToDeals: addToDeals,
      getRushes: getRushes,
      findDistance: findDistance,
      getOwnerLocation: getOwnerLocation,
      declareRush: declareRush
    }
  });
