(function() {

  _.mixin({
    slug: function(string) {
      return _.invoke(string.split(/[-_\s]/), 'toLowerCase').join('-');
    }
  });

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

    for (var prop in data) self[prop] = data[prop];

    self.highlights = {};
    _.each(self.responses, function(response) {
      var questionSlug = _.slug(response.question);
      self.highlights[questionSlug] = {};
      _.each(response.responses, function(response) {
        var responseSlug = _.slug(response.response.description);
        self.highlights[questionSlug][responseSlug] = false;
      });
    });

    self.highlight = function(question, response) {
      var questionSlug = _.slug(question.question),
          responseSlug = _.slug(response.response.description);
      self.highlights[questionSlug][responseSlug] = !self.highlights[questionSlug][responseSlug];
    };

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
