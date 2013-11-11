// Generated by CoffeeScript 1.6.3
(function() {
  var controller;

  controller = function(scope, timeout) {
    var everySecond, timer;
    timer = null;
    everySecond = function() {
      timer = timeout(everySecond, 1000);
      if (!scope.model.get('pause')) {
        scope.model.increment('count', -1);
        if (scope.model.get('status') === 'work' && scope.model.get('count') <= 0) {
          scope.model.set('count', scope.model.get('break'));
          scope.model.set('status', 'rest');
        }
        if (scope.model.get('status') === 'rest' && scope.model.get('count') <= 0) {
          scope.model.set('status', 'done');
          scope.model.set('pause', true);
        }
        if (scope.model.get('status') !== 'done') {
          return scope.onChange()(scope.model);
        }
      }
    };
    everySecond();
    scope.doPause = function() {
      scope.model.set('pause', !scope.model.get('pause'));
      return scope.onChange()(scope.model);
    };
    return scope.doRemove = function() {
      timeout.cancel(timer);
      return scope.remove()(scope.model);
    };
  };

  angular.module('drinksApp').directive('durable', function() {
    return {
      templateUrl: 'views/directives/durable.html',
      restrict: 'E',
      scope: {
        model: '=',
        entity: '@',
        onChange: '&change',
        remove: '&remove'
      },
      replace: true,
      controller: ['$scope', '$timeout', controller]
    };
  });

}).call(this);

/*
//@ sourceMappingURL=durable.map
*/