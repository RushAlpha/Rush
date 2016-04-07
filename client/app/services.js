angular.module('Rush.services', [])
.factory('AuthFactory', function(){

  var postSignIn = function(username, password) {
    return $http.post('/signin', {username:username, password: password})
  }

  var postSignUp = function(username, password, isOwner) {
    return $http.post('/signup', {username: username, password: password, isOwner: isOwner})
    }
})
