angular.module('starter.services', [])

.factory('Recommendations', function() {
  // Might use a resource here that returns a JSON array
  var recommendations = [{
    id: 0,
    text: 'Schedule it in. Set aside time for your walk just as you would a business meeting',
  }, {
    id: 1,
    text: 'Be prepared. Keep a pair of walking shoes in your car and walk whenever you can.',
  }, {
    id: 2,
    text: 'Have a Plan B. If you miss a day know exactly how you’re going to get back on track.',
  }];

  return {
    all: function() {
      return recommendations;
    },
    get: function(recommendationId) {
      for (var i = 0; i < recommendations.length; i++) {
        if (recommendations[i].id === parseInt(recommendationId)) {
          return recommendations[i];
        }
      }
      return null;
    }
  };
});
