angular.module('starter.controllers', [])
.controller('LoginCtrl', function($scope, auth, $state, store, $localStorage, $sessionStorage) {
  function doAuth() {
    auth.signin({
      closable: false,
      // This asks for the refresh token
      // So that the user never has to log in again
      authParams: {
        scope: 'openid offline_access'
      }
    }, function(profile, idToken, accessToken, state, refreshToken) {
      store.set('profile', profile);
      store.set('token', idToken);
      store.set('refreshToken', refreshToken);
      $state.go('tab.dash');
    }, function(error) {
      console.log("There was an error logging in", error);
    });
  }

  $scope.$on('$ionic.reconnectScope', function() {
    doAuth();
  });

  doAuth();

})

.controller('DashCtrl', function($scope, $http, $localStorage, $sessionStorage, auth, store, $state, Recommendations) {

  var arr = JSON.parse( localStorage.getItem('profile') );
  var averageSteps = arr["averageDailySteps"];
  var userAge = arr["age"];
  var requiredStepsAge = "";
  var evaluation = "";
  var evaluationWithAge = "";
  var recommendation = "";
  var recommendationsArray = Recommendations.all();
  var randomValue = recommendationsArray[Math.floor(Math.random() * recommendationsArray.length)]

  if (userAge < 50) {
    requiredStepsAge = 10000;
  }
  else {
    requiredStepsAge = 8000;
  }

  $scope.labels = ["Me", "Country", "Age Group"];
     $scope.series = ["Me", 'Country', "Age Group"];
     $scope.data = [
         [4000, 5117, requiredStepsAge]
     ];

  // For steps evaluation with country. Average American walks 5117 steps/day.
  if (averageSteps < 3000) {
    evaluation = "Poorly";
  }
  else if (averageSteps < 4000) {
    evaluation = "Good";
  }
  else {
    evaluation = "Great";
  };

  // For the steps evaluation with age.
  if (averageSteps < 8000 && userAge < 50) {
    evaluationWithAge = "Poorly";
    recommendation = randomValue["text"];
  }
  else if (averageSteps < 10000 && userAge < 50) {
    evaluationWithAge = "Good";
    recommendation = randomValue["text"];
  }
  else if (averageSteps < 12000 && userAge < 50) {
    evaluationWithAge = "Great";
    recommendation = randomValue["text"];
  }
  else if (averageSteps > 7000 && userAge > 50) {
    evaluationWithAge = "Good";
    recommendation = randomValue["text"];
  }
  else if (averageSteps > 9000 && userAge > 50) {
    evaluationWithAge = "Great";
    recommendation = randomValue["text"];
  }
  else {
    evaluationWithAge = "Great"
    recommendation = "Good work! Keep doing what you're doing."
  };

  $scope.$storage = $localStorage.$default({
      arr,
      "userResult": evaluation,
      "userResultWithAge": evaluationWithAge,
      "recommendation": recommendation,
  });

  $scope.logout = function() {
    auth.signout();
    store.remove('token');
    store.remove('profile');
    store.remove('refreshToken');
    $state.go('login', {}, {reload: true});
  };

  $scope.recommendations = Recommendations.all();
});
