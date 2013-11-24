// Generated by CoffeeScript 1.6.3
(function() {
  var controller;

  controller = function(scope, timeout) {
    var count, everyPeriod, originalCount, pausesTime, play, runInterval, sounds, timePassed, timer;
    if (!scope.show) {
      return;
    }
    scope.mute = true;
    scope.newName = scope.model.get('name');
    scope.save = function() {
      scope.model.set('name', scope.newName);
      scope.model.save();
      return scope.editing = false;
    };
    timer = null;
    sounds = {
      tick: 'sounds/tick.mp3',
      crank: 'sounds/crank.mp3',
      alarm: 'sounds/alarm.mp3',
      current: null
    };
    play = function(song) {
      var _ref, _ref1;
      if ((_ref = sounds.current) != null) {
        _ref.pause();
      }
      sounds.current = new Audio(song);
      return (_ref1 = sounds.current) != null ? _ref1.play() : void 0;
    };
    pausesTime = _.reduce(_.map(scope.model.get('pauses'), function(p) {
      if (p.end) {
        return p.end - p.start;
      } else {
        return new Date() - p.start;
      }
    }), function(x, y) {
      return x + y;
    });
    if (pausesTime == null) {
      pausesTime = 0;
    }
    timePassed = (new Date() - scope.model.createdAt - pausesTime) / 1000;
    if (timePassed < 1) {
      play(sounds.crank);
    }
    originalCount = scope.model.get('sprint') + scope.model.get('rest');
    count = function() {
      return originalCount - timePassed;
    };
    scope.getTime = function() {
      if (count() - scope.model.get('rest') > 0) {
        return count() - scope.model.get('rest');
      } else {
        return count();
      }
    };
    everyPeriod = 1000;
    runInterval = function() {
      var pause, _ref, _ref1;
      timer = timeout(runInterval, everyPeriod);
      pause = scope.model.get('pause');
      timePassed = (new Date() - scope.model.createdAt - pausesTime) / 1000;
      if (!pause.start) {
        if (scope.model.get('status') !== 'done') {
          if (count() > 0) {
            if (!scope.mute) {
              play(sounds.tick);
            } else {
              if ((_ref = sounds.current) != null) {
                _ref.pause();
              }
            }
            if (scope.model.get('status') === 'work' && count() <= scope.model.get('rest')) {
              play(sounds.alarm);
              scope.model.set('status', 'rest');
              return scope.onChange()(scope.model);
            }
          } else {
            play(sounds.alarm);
            scope.model.set('status', 'done');
            return scope.onChange()(scope.model);
          }
        } else {
          timeout.cancel(timer);
          return scope.onChange()(scope.model);
        }
      } else {
        return (_ref1 = sounds.current) != null ? _ref1.pause() : void 0;
      }
    };
    timeout(runInterval, everyPeriod);
    scope.doPause = function() {
      var pause, _ref;
      if ((_ref = sounds.current) != null) {
        _ref.pause();
      }
      pause = scope.model.get('pause');
      if (!pause.start) {
        scope.model.set('pause', {
          start: new Date(),
          end: null
        });
      } else {
        pause.end = new Date();
        scope.model.add('pauses', pause);
        scope.model.set('pause', {});
      }
      return scope.onChange()(scope.model);
    };
    scope.doRemove = function() {
      var _ref;
      timeout.cancel(timer);
      scope.remove()(scope.model);
      return (_ref = sounds.current) != null ? _ref.pause() : void 0;
    };
    scope.$on('$routeChangeStart', function(next, current) {
      var _ref;
      timeout.cancel(timer);
      scope.onChange()(scope.model);
      return (_ref = sounds.current) != null ? _ref.pause() : void 0;
    });
    return scope.whenDone = function(model) {
      return model.get('status') === 'done';
    };
  };

  angular.module('manageApp').directive('durable', function() {
    return {
      templateUrl: 'views/directives/durable.html',
      restrict: 'E',
      scope: {
        model: '=',
        onChange: '&change',
        remove: '&remove',
        show: '='
      },
      replace: true,
      controller: ['$scope', '$timeout', controller]
    };
  });

}).call(this);

/*
//@ sourceMappingURL=durable.map
*/
