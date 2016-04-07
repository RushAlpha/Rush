angular.module('Rush.services', [])
.factory('AuthFactory', function($http){

  var postSignIn = function(username, password) {
    return $http.post('/signin', {username:username, password: password})
  }

  var postSignUp = function(username, password, isOwner) {
    return $http.post('/signup', {username: username, password: password, isOwner: isOwner})
  }
  return {
    postSignIn: postSignIn,
    postSignUp: postSignUp
  }
})
