// Generated by CoffeeScript 1.6.3
(function() {
  var controller;

  controller = function(location, scope, element, attrs) {
    return console.log(scope);
  };

  angular.module('drinksApp').directive('drink', function() {
    return {
      templateUrl: 'views/directives/drink.html',
      restrict: 'E',
      scope: {
        name: '@',
        description: '@',
        img: '@'
      },
      controller: ['$location', '$scope', '$element', '$attrs', controller]
    };
  });

}).call(this);

/*
//@ sourceMappingURL=drink.map
*/
