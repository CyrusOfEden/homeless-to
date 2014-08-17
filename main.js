(function() {

  angular.module('HomelessTO', []).
    controller('DataCtrl', DataController).
    filter('titleize', function() {
      return function(text, scope) {
        return text.replace(/[-_]/, ' ').split(' ').map(function(word) {
          return word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase();
        }).join(' ');
      };
    });

  function DataController($scope) {
    $scope._ = _;
    var self = this;

    for (var prop in data) {
      self[prop] = data[prop];
    }

    self.sort = {};
    self.order = function(prop) {
      if (self.sort.property == prop) {
        self.sort.direction = !self.sort.direction;
      } else {
        self.sort.property = prop;
        self.sort.direction = true;
      }
    };

    self.title = "Toronto's Homeless";
    self.select = function(responseIndex) {
      self.selection = responseIndex;
      self.response = self.responses[responseIndex];
      self.title = (self.response ? self.response.question : "Toronto's Homeless");
    };
  }


})();
